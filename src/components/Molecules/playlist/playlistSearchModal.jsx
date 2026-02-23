import { Modal, TextInput, Button, ScrollArea, Group, Text, Loader, Stack } from "@mantine/core";
import { useState } from "react";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import axios from "axios";
import { Duration } from "luxon";

export default function PlaylistSearchModal(props) {
  const {
    opened,
    close,
    searchVideos,
    searchResults,
    isSearching,
    addVideoToPlaylist,
    activePlaylist,
    activePlaylistVideos, // これ使ってないかも
  } = props;

  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos(query);
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
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setQuery("");
      }}
      title={<span className="font-bold text-lg">動画を検索して追加</span>}
      size="lg"
      yOffset="5vh"
    >
      <form onSubmit={handleSearch} className="mb-4">
        <Group>
          <TextInput
            className="flex-1"
            placeholder="キーワードを入力..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-autofocus
            rightSection={isSearching && <Loader size="xs" />}
          />
          <Button type="submit" leftSection={<FaMagnifyingGlass />} loading={isSearching}>
            検索
          </Button>
        </Group>
      </form>

      <ScrollArea h={400} offsetScrollbars>
        <Stack spacing="md">
          {searchResults.map((video) => (
            <div key={video.id.videoId} className="flex gap-3 p-2 hover:bg-zinc-100 rounded-lg border border-transparent hover:border-zinc-200 transition-colors">
              <div className="w-32 h-20 bg-zinc-200 shrink-0 rounded overflow-hidden relative">
                <img 
                  src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <Text size="sm" weight={600} className="line-clamp-2 leading-tight" title={video.snippet.title}>
                    {video.snippet.title}
                  </Text>
                  <Text size="xs" color="dimmed" className="mt-1">
                    {video.snippet.channelTitle}
                  </Text>
                </div>
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
              </div>
            </div>
          ))}
          {searchResults.length === 0 && query && !isSearching && (
            <Text color="dimmed" align="center" mt="xl">検索結果がありません</Text>
          )}
        </Stack>
      </ScrollArea>
    </Modal>
  );
}
