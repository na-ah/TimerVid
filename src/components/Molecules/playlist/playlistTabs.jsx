import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, Tabs, ActionIcon, Button, Group } from "@mantine/core";
import { FaPlus, FaTrash } from "react-icons/fa6";
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
              className={isMinimal ? "w-full pl-2 h-full flex flex-col" : "ml-5 w-full"}
            >
              {!isMinimal ? (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-3 mb-5 gap-3">
                  <Group spacing="sm" align="center">
                    <h1 className="text-2xl font-bold m-0">{activePlaylist}</h1>
                    {canDeletePlaylist && isWorking === (tabMode === "work") && (
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        title="このプレイリストを削除"
                        onClick={() => {
                          if (removePlaylist) removePlaylist();
                        }}
                        className="mt-1"
                      >
                        <FaTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                  
                  <Group spacing="sm">
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
                  </Group>
                </div>
              ) : (
                <div className="mb-2 mt-1 flex-shrink-0">
                  <h3 className="font-bold text-lg truncate text-zinc-700 dark:text-zinc-300">
                    {activePlaylist}
                  </h3>
                </div>
              )}

              <div className={`${isMinimal ? "flex-1 h-full" : "h-[300px]"} overflow-auto`}>
                <Table
                  stickyHeader
                  highlightOnHover
                  striped={isMinimal}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="text-center w-8">#</Table.Th>
                      <Table.Th className="text-left">title</Table.Th>
                      {!isMinimal && <Table.Th className="text-right w-16">len</Table.Th>}
                      {!isMinimal && <Table.Th className="text-center w-8"></Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {videos.length > 0 &&
                      playlist.videoIds.map((videoId, index) => {
                        const video = videos.find(
                          (item) => item.id === videoId
                        );
                        
                        if (!video) return null;

                        return (
                          <Table.Tr
                            key={`${video.id}-${index}`}
                            onClick={() => setCurrentVideoId(video.id)}
                            className="cursor-pointer group"
                            style={{
                              background:
                                currentVideoIndex === index
                                  ? "var(--mantine-color-green-1)" // Using Mantine var or fallback
                                  : "none",
                              fontWeight: currentVideoIndex === index ? "bold" : "normal",
                            }}
                          >
                            <Table.Td className="text-center text-xs sm:text-sm">
                              {String(index + 1).padStart(2, "0")}
                            </Table.Td>
                            <Table.Td className="text-left text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                              {video.title}
                            </Table.Td>
                            {!isMinimal && (
                              <Table.Td className="text-right text-xs">
                                {video.length}
                              </Table.Td>
                            )}
                            {!isMinimal && (
                              <Table.Td className="text-center w-12">
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
