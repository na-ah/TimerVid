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
  } = props;

  // プレイリストが1つしかない場合は削除ボタンを隠す
  const canDeletePlaylist = playlists && playlists.length > 1;

  return (
    <>
      <Tabs
        orientation="vertical"
        onChange={setActivePlaylist}
        value={activePlaylist}
      >
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
        {playlists &&
          playlists.length > 0 &&
          playlists?.map((playlist, i) => (
            <Tabs.Panel
              key={i}
              value={playlist.title}
              className="ml-5 w-full"
            >
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
              <div className="h-[300px] overflow-auto">
                <Table
                  stickyHeader
                  highlightOnHover
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="text-center">#</Table.Th>
                      <Table.Th className="text-center"> title</Table.Th>
                      <Table.Th className="text-center">length</Table.Th>
                      <Table.Th className="text-center"></Table.Th>
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
                                  ? "#bbf7d0"
                                  : "none",
                            }}
                          >
                            <Table.Td className="text-center">
                              {String(index + 1).padStart(2, "0")}
                            </Table.Td>
                            <Table.Td className="text-left">
                              {video.title}
                            </Table.Td>
                            <Table.Td className="text-right">
                              {video.length}
                            </Table.Td>
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
