import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, Tabs, ActionIcon, Button, Group } from "@mantine/core";
import { FaPlus, FaTrash } from "react-icons/fa6";
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
              className={isMinimal ? "w-full pl-2 h-full flex flex-col" : "ml-0 sm:ml-4 flex-1 min-w-0 flex flex-col"}
            >
              {!isMinimal ? (
                <div className="flex flex-wrap items-center justify-between my-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold m-0 truncate" title={activePlaylist}>
                      {activePlaylist}
                    </h1>
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

              <div className={`${isMinimal ? "flex-1 h-full" : "h-[300px]"} overflow-auto custom-scrollbar`}>
                <Table
                  stickyHeader
                  highlightOnHover
                  className={isMinimal ? "border-t border-white/5" : ""}
                  layout="fixed"
                >
                  {!isMinimal && (
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="text-center w-8">#</Table.Th>
                        <Table.Th className="text-left w-auto">title</Table.Th>
                        <Table.Th className="text-right w-16">len</Table.Th>
                        <Table.Th className="text-center w-12"></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                  )}
                  <Table.Tbody>
                    {videos.length > 0 &&
                      playlist.videoIds.map((videoId, index) => {
                        const video = videos.find(
                          (item) => item.id === videoId
                        );
                        
                        if (!video) return null;

                        const isActive = currentVideoIndex === index;

                        return (
                          <Table.Tr
                            key={`${video.id}-${index}`}
                            onClick={() => setCurrentVideoId(video.id)}
                            className={`cursor-pointer group border-b border-white/5 transition-colors ${
                              isActive 
                                ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                                : "hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            <Table.Td className="text-center text-xs py-3 border-none w-8">
                              {String(index + 1).padStart(2, "0")}
                            </Table.Td>
                            <Table.Td className="text-left text-xs sm:text-sm py-3 border-none">
                              <div className="truncate w-full max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-none">
                                <span className={isActive ? "text-indigo-400" : ""}>{video.title}</span>
                              </div>
                            </Table.Td>
                            {!isMinimal && (
                              <Table.Td className="text-right text-xs py-3 border-none w-16">
                                {video.length}
                              </Table.Td>
                            )}
                            {!isMinimal && (
                              <Table.Td className="text-center w-12 py-3 border-none">
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (removeVideoFromPlaylist) {
                                      removeVideoFromPlaylist(video.id, playlist.title);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="動画を削除"
                                >
                                  <FaTrash size={14} />
                                </ActionIcon>
                              </Table.Td>
                            )}
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </div>
            </Tabs.Panel>
          ))}
      </Tabs>
    </>
  );
}
