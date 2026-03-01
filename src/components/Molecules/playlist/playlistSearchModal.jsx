import { Modal, TextInput, Button, ScrollArea, Group, Text, Loader, Stack, Select, Center } from "@mantine/core";
import { useState, useEffect } from "react";
import { FaPlus, FaPlay, FaXmark } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Duration } from "luxon";
import YouTube from "react-youtube";
import { useAtomValue } from "jotai";
import { playerAtom } from "../../../atoms/atoms";

export default function PlaylistSearchModal(props) {
  const {
    opened,
    close,
    searchVideos,
    searchResults,
    isSearching,
    nextPageToken,
    addVideoToPlaylist,
    activePlaylist,
  } = props;

  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const [sortOrder, setSortOrder] = useState("relevance");
  const mainPlayer = useAtomValue(playerAtom);

  // プレビュー開始時にメインプレイヤーを一時停止
  useEffect(() => {
    if (previewVideoId && mainPlayer && mainPlayer.getPlayerState() === 1) {
      mainPlayer.pauseVideo();
    }
  }, [previewVideoId, mainPlayer]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setPreviewVideoId(null);
    searchVideos(query, sortOrder);
  };

  const handleLoadMore = () => {
    searchVideos(query, sortOrder, nextPageToken);
  };

  const handleAdd = async (video) => {
    const videoId = video.id.videoId;
    setAddingId(videoId);

    // 長さを取得
    let length = "0:00";
    try {
      const config = {
        url: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API}/videos`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        params: {
          part: "contentDetails",
          id: videoId,
          key: `${process.env.NEXT_PUBLIC_GOOGLE_YOUTUBE_API_KEY}`,
        },
      };
      const res = await axios(config);
      if (res.data.items && res.data.items.length > 0) {
        const duration = Duration.fromISO(res.data.items[0].contentDetails.duration);
        length = duration.hours === 0 ? duration.toFormat("m:ss") : duration.toFormat("h:mm:ss");
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    }

    addVideoToPlaylist(videoId, video.snippet.title, length, activePlaylist);
    setAddingId(null);
    setPreviewVideoId(null);
  };

  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const hasSearched = searchResults.length > 0 || (query && !isSearching);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setQuery("");
        setPreviewVideoId(null);
      }}
      title={<span className="font-bold text-lg">動画を検索して追加</span>}
      size="lg"
      yOffset="5vh"
    >
      <form onSubmit={handleSearch} className="mb-4">
        <Stack spacing="xs">
          <Group spacing="xs">
            <TextInput
              className="flex-1"
              placeholder="キーワードを入力..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-autofocus
              rightSection={isSearching && <Loader size="xs" />}
            />
            <Button type="submit" leftSection={<FaSearch />} loading={isSearching && !nextPageToken}>
              検索
            </Button>
          </Group>
          
          <Group position="right">
            <Select
              size="xs"
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value);
                if (query) {
                  setTimeout(() => searchVideos(query, value), 0);
                }
              }}
              data={[
                { value: 'relevance', label: '関連度順' },
                { value: 'date', label: 'アップロード日順' },
                { value: 'viewCount', label: '再生回数順' },
                { value: 'rating', label: '評価順' },
              ]}
              w={150}
            />
          </Group>
        </Stack>
      </form>

      {hasSearched && (
        <ScrollArea h={500} offsetScrollbars>
          <Stack spacing="md" pb="xl">
            {searchResults.map((video) => {
              const isPreviewing = previewVideoId === video.id.videoId;
              return (
                <div key={video.id.videoId} className="flex flex-col gap-2 p-2 hover:bg-zinc-100 rounded-lg border border-transparent hover:border-zinc-200 transition-colors">
                  <div className="flex gap-3">
                    <div 
                      className="w-32 h-20 bg-zinc-200 shrink-0 rounded overflow-hidden relative cursor-pointer group"
                      onClick={() => setPreviewVideoId(isPreviewing ? null : video.id.videoId)}
                    >
                      <img 
                        src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url} 
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                          <FaPlay className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <Text size="sm" weight={600} className="line-clamp-2 leading-tight" title={video.snippet.title}>
                          {video.snippet.title}
                        </Text>
                        <Text size="xs" color="dimmed" className="mt-1">
                          {video.snippet.channelTitle} • {video.snippet.publishTime?.split('T')[0]}
                        </Text>
                      </div>
                      {!isPreviewing && (
                        <Group position="right">
                          <Button 
                            size="xs" 
                            variant="light" 
                            color="indigo" 
                            leftSection={<FaPlus />}
                            loading={addingId === video.id.videoId}
                            onClick={() => handleAdd(video)}
                          >
                            追加
                          </Button>
                        </Group>
                      )}
                    </div>
                  </div>

                  {/* プレビュープレーヤー */}
                  {isPreviewing && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-md">
                         <YouTube
                           videoId={video.id.videoId}
                           opts={playerOpts}
                           className="w-full h-full"
                         />
                      </div>
                      <Group position="apart" className="bg-zinc-50 p-2 rounded-md border border-zinc-200">
                        <Button 
                          size="sm" 
                          variant="subtle" 
                          color="gray" 
                          leftSection={<FaXmark />}
                          onClick={() => setPreviewVideoId(null)}
                        >
                          プレビューを閉じる
                        </Button>
                        <Button 
                          size="sm" 
                          variant="filled" 
                          color="indigo" 
                          leftSection={<FaPlus />}
                          loading={addingId === video.id.videoId}
                          onClick={() => handleAdd(video)}
                          className="shadow-sm"
                        >
                          この動画を追加
                        </Button>
                      </Group>
                    </div>
                  )}
                </div>
              );
            })}
            
            {searchResults.length === 0 && query && !isSearching && (
              <Text color="dimmed" align="center" mt="xl">検索結果がありません</Text>
            )}

            {searchResults.length > 0 && nextPageToken && (
               <Center mt="md">
                 <Button 
                   variant="subtle" 
                   onClick={handleLoadMore} 
                   loading={isSearching}
                 >
                   さらに読み込む
                 </Button>
               </Center>
            )}
          </Stack>
        </ScrollArea>
      )}
    </Modal>
  );
}
