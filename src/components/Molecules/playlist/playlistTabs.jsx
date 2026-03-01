import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, Tabs, ActionIcon, Button, Group } from "@mantine/core";
import { FaPlus, FaTrash, FaPlay, FaPen } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { RiPlayListAddFill } from "react-icons/ri";

export default function PlaylistTabs(props) {
  const {
    playlists,
    videos,
    setCurrentVideoId,
    activePlaylist,
    setActivePlaylist,
    openAddVideo,
    openAddVideoList,
    openSearchVideo, // New prop
    currentVideoIndex,
    removeVideoFromPlaylist,
    removePlaylist,
    renamePlaylist, // New prop
    isWorking,
    tabMode,
    isMinimal, // New prop for Cinema Mode
  } = props;

  // プレイリストが1つしかない場合は削除ボタンを隠す
  const canDeletePlaylist = playlists && playlists.length > 1;

  return (
    <>
      <Tabs
        orientation="vertical"
        onChange={setActivePlaylist}
        value={activePlaylist}
        className={isMinimal ? "flex-col h-full" : ""}
      >
        {!isMinimal && (
          <Tabs.List>
            {playlists &&
              playlists.length > 0 &&
              playlists.map((playlist, i) => (
                <Tabs.Tab
                  key={i}
                  value={playlist.title}
                >
                  {playlist.title}
                </Tabs.Tab>
              ))}
          </Tabs.List>
        )}

        {playlists &&
          playlists.length > 0 &&
          playlists?.map((playlist, i) => (
            <Tabs.Panel
              key={i}
              value={playlist.title}
              className={isMinimal ? "w-full h-full flex flex-col pt-2" : "ml-0 sm:ml-4 flex-1 min-w-0 flex flex-col"}
            >
              {!isMinimal ? (
                <div className="flex flex-wrap items-center justify-between my-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold m-0 truncate" title={activePlaylist}>
                      {activePlaylist}
                    </h1>
                    {isWorking === (tabMode === "work") && (
                      <ActionIcon
                        variant="subtle"
                        title="プレイリスト名を変更"
                        onClick={() => {
                          const newName = window.prompt("新しいプレイリスト名を入力してください", activePlaylist);
                          if (newName) {
                            if (renamePlaylist) renamePlaylist(activePlaylist, newName);
                          }
                        }}
                        className="flex-shrink-0 text-zinc-400 hover:text-zinc-600"
                      >
                        <FaPen size={14} />
                      </ActionIcon>
                    )}
                    {canDeletePlaylist && isWorking === (tabMode === "work") && (
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        title="このプレイリストを削除"
                        onClick={() => {
                          if (removePlaylist) removePlaylist();
                        }}
                        className="flex-shrink-0"
                      >
                        <FaTrash size={16} />
                      </ActionIcon>
                    )}
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="light"
                      color="teal"
                      size="sm"
                      leftSection={<FaSearch />}
                      onClick={openSearchVideo}
                    >
                      検索
                    </Button>
                    <Button
                      id="tutorial3-1"
                      variant="light"
                      color="blue"
                      size="sm"
                      leftSection={<FaPlus />}
                      onClick={openAddVideo}
                    >
                      動画を追加
                    </Button>
                    <Button
                      id="tutorial5-1"
                      variant="light"
                      color="indigo"
                      size="sm"
                      leftSection={<RiPlayListAddFill />}
                      onClick={openAddVideoList}
                    >
                      一括追加
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className={`${isMinimal ? "flex-1 h-full pr-2" : "h-[300px]"} overflow-auto custom-scrollbar`}>
                <div className="flex flex-col gap-2 pb-4">
                  {videos.length > 0 &&
                    playlist.videoIds.map((videoId, index) => {
                      const video = videos.find(
                        (item) => item.id === videoId
                      );
                      
                      if (!video) return null;

                      const isActive = currentVideoIndex === index;

                      return (
                        <div
                          key={`${video.id}-${index}`}
                          onClick={() => setCurrentVideoId(video.id)}
                          className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${
                            isActive 
                              ? (isMinimal ? "bg-indigo-600/20 border-indigo-500/50" : "bg-indigo-50 border-indigo-200") 
                              : (isMinimal ? "bg-zinc-900/40 border-white/5 hover:bg-white/10 hover:border-white/10" : "bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200")
                          }`}
                        >
                          <div className={`relative shrink-0 overflow-hidden rounded-md bg-black/10 flex items-center justify-center ${
                            isMinimal ? "w-24 h-14" : "w-20 h-12"
                          }`}>
                            <img 
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                              alt={video.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            {isActive ? (
                               <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center backdrop-blur-[1px]">
                                 <FaPlay className="text-white drop-shadow-md" size={14} />
                               </div>
                            ) : (
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                 <FaPlay className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={14} />
                               </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className={`text-sm font-medium line-clamp-2 leading-tight ${
                              isActive 
                                ? (isMinimal ? "text-indigo-300" : "text-indigo-700") 
                                : (isMinimal ? "text-zinc-300 group-hover:text-white" : "text-zinc-700")
                            }`}>
                              {video.title}
                            </span>
                            {!isMinimal && (
                              <span className="text-xs text-zinc-500 mt-0.5">{video.length}</span>
                            )}
                          </div>

                          {!isMinimal && (
                             <ActionIcon
                               color="red"
                               variant="subtle"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (removeVideoFromPlaylist) {
                                   removeVideoFromPlaylist(video.id, playlist.title);
                                 }
                               }}
                               className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                               title="動画を削除"
                             >
                               <FaTrash size={14} />
                             </ActionIcon>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </Tabs.Panel>
          ))}
      </Tabs>
    </>
  );
}
