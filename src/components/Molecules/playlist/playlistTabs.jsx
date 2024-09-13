import { Table, Tabs } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
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
  } = props;

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
              className="ml-5"
            >
              <div className="flex justify-between">
                <h1 className="text-2xl mt-3 mb-5">{activePlaylist}</h1>
                <div className="mr-1 flex gap-3">
                  <button
                    id="tutorial3-1"
                    onClick={openAddVideo}
                  >
                    <FaPlus />
                  </button>
                  <button id="tutorial5-1">
                    <RiPlayListAddFill onClick={openAddVideoList} />
                  </button>
                </div>
              </div>
              <div className="h-fit">
                <Table
                  stickyHeader
                  highlightOnHover
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="text-center">#</Table.Th>
                      <Table.Th className="text-center"> title</Table.Th>
                      <Table.Th className="text-center">length</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {videos.length > 0 &&
                      playlist.videoIds.map((videoId, index) => {
                        const video = videos.find(
                          (item) => item.id === videoId
                        );

                        return (
                          <Table.Tr
                            key={video.id}
                            onClick={() => setCurrentVideoId(video.id)}
                            className="cursor-pointer"
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
