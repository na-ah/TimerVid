import { useContext, useState } from "react";
import PlaylistTabs from "../../Molecules/playlist/playlistTabs";
import { PlaylistContext } from "../../../context/playlistProvider";
import PlaylistInfo from "../../Molecules/playlist/playlistInfo";
import PlaylistAddVideoModal from "../../Molecules/playlist/playlistAddVideoModal";
import { Tabs, ActionIcon, Tooltip, Group, Button, Modal, Text, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GoArrowSwitch } from "react-icons/go";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import PlaylistAddVideoListModal from "../../Molecules/playlist/playlistAddVideoListModal";
import { FaPlus, FaExpand, FaCompress, FaList, FaPlay } from "react-icons/fa6";
import PlaylistAddModal from "../../Molecules/playlist/playlistAddModal";
import PlaylistSearchModal from "../../Molecules/playlist/playlistSearchModal";

export default function PlaylistContainer({ children, isCinemaMode, setIsCinemaMode }) {
  const { workPlaylist } = useContext(PlaylistContext);
  const { breakPlaylist } = useContext(PlaylistContext);
  const {
    isWorking,
    switchStatus,
    selectedPlaylist,
    setSelectedPlaylist,
    nextVideo,
    prevVideo,
    removePlaylist,
    changeSubPlaylist,
  } = useContext(PlaylistContext);

  const [opened, { open, close }] = useDisclosure(false);
  const activeContext = selectedPlaylist === 'work' ? workPlaylist : breakPlaylist;

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={close} 
        title={<span className="font-bold text-xl text-zinc-800">プレイリストを選択</span>} 
        centered 
        size="lg"
        overlayProps={{ blur: 4, color: "#0f1115", opacity: 0.6 }}
        radius="lg"
        padding="xl"
      >
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {activeContext.playlists.map((pl, i) => {
            const isActive = activeContext.activePlaylist === pl.title;
            return (
              <button
                key={i}
                onClick={() => { 
                  changeSubPlaylist(pl.title, selectedPlaylist);
                  close(); 
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border text-left
                  ${isActive 
                    ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                    : "bg-white border-zinc-200 hover:border-indigo-300 hover:bg-zinc-50 hover:shadow-md"
                  }
                `}
              >
                <ThemeIcon 
                  size="xl" 
                  radius="md" 
                  variant={isActive ? "filled" : "light"} 
                  color={isActive ? "indigo" : "gray"}
                  className="shrink-0"
                >
                  {isActive ? <FaPlay size={14} /> : <FaList size={16} />}
                </ThemeIcon>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <Text size="md" weight={700} className={`truncate ${isActive ? "text-indigo-900" : "text-zinc-800"}`}>
                    {pl.title}
                  </Text>
                  <Text size="sm" className={isActive ? "text-indigo-600/80" : "text-zinc-500"}>
                    {pl.videoIds.length} 本の動画
                  </Text>
                </div>

                {isActive && (
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-100 px-2 py-1 rounded-md shrink-0">
                    再生中
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Modal>

      <div className={`flex flex-col w-full transition-all duration-500 ${isCinemaMode ? "flex-1 h-full min-h-0" : ""}`}>
        
        {/* Cinema Mode Header */}
        {isCinemaMode && (
          <div className="flex items-center justify-between mb-6 w-full px-2 flex-shrink-0">
            <Button 
              leftSection={<FaCompress size={14} />} 
              variant="subtle" 
              color="gray" 
              onClick={() => setIsCinemaMode(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-lg px-4"
            >
              通常モードへ戻る
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Now Playing</span>
                <span className="font-bold text-lg text-zinc-100 hidden sm:inline-block max-w-[240px] truncate">
                  {activeContext.activePlaylist}
                </span>
              </div>
              <Button 
                leftSection={<FaList size={14} />} 
                variant="filled" 
                color="indigo" 
                onClick={open}
                size="md"
                className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 rounded-lg"
              >
                リスト選択
              </Button>
            </div>
          </div>
        )}

        <div className={`flex w-full items-start flex-1 overflow-hidden transition-all duration-700 ease-in-out ${isCinemaMode ? "flex-col lg:flex-row gap-8" : "flex-col gap-4"}`}>
          {/* Left Column: Player & Current Info */}
          <div
            className={`flex flex-col w-full transition-all duration-500 ease-in-out ${
              isCinemaMode ? "h-full lg:w-[72%]" : "shrink-0"
            }`}
          >
            {/* Player Container */}
            <div className={`w-full overflow-hidden flex-shrink-0 ${
              isCinemaMode 
                ? "h-full flex flex-col rounded-2xl shadow-2xl shadow-black/50" 
                : "rounded-xl shadow-lg"
            }`}>
              {children}
            </div>
          </div>

          {/* Right Column: Playlist Selection */}
          <div
            className={`w-full flex flex-col transition-all duration-500 ease-in-out ${
              isCinemaMode ? "h-full lg:w-[28%]" : "flex-1 overflow-hidden"
            }`}
          >
            <div className={`w-full h-full flex flex-col ${
              isCinemaMode 
                ? "bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden p-1 shadow-xl" 
                : ""
            }`}>
              <Tabs
                className={`w-full h-full flex flex-col ${isCinemaMode ? "overflow-hidden" : ""}`}
                defaultValue={isWorking ? "work" : "break"}
                value={selectedPlaylist}
                onChange={setSelectedPlaylist}
              >
                {!isCinemaMode && (
                <Tabs.List className="flex items-center w-full flex-wrap flex-shrink-0">
                  <Tabs.Tab value="work">work playlist</Tabs.Tab>
                  <Tabs.Tab value="break">
                    <span id="tutorial4-2">break playlist</span>
                  </Tabs.Tab>
                  <div className="ml-auto flex items-center gap-2 px-2 pb-2 mt-2 sm:mt-0">
                    <Group spacing="xs" className="hidden xl:flex">
                      <Tooltip label="作業/休憩を切り替え" position="bottom" withArrow>
                        <ActionIcon variant="light" color="blue" onClick={switchStatus} size="lg">
                          <GoArrowSwitch size={20} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="前の動画" position="bottom" withArrow>
                        <ActionIcon variant="light" color="blue" onClick={prevVideo} size="lg">
                          <TbPlayerTrackPrevFilled size={20} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="次の動画" position="bottom" withArrow>
                        <ActionIcon variant="light" color="blue" onClick={nextVideo} size="lg">
                          <TbPlayerTrackNextFilled size={20} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                    
                    <Button
                      id="tutorial2-1"
                      leftSection={<FaPlus />}
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        selectedPlaylist == "work"
                          ? workPlaylist.openAddPlaylist()
                          : breakPlaylist.openAddPlaylist();
                      }}
                    >
                      新規
                    </Button>
                  </div>
                </Tabs.List>
              )}

              <Tabs.Panel value="work" className="flex-1 overflow-hidden h-full">
                <div className={`my-4 h-full flex flex-col ${isCinemaMode ? "overflow-hidden" : "overflow-y-auto"}`}>
                  {!isCinemaMode && (
                    <div className="flex-shrink-0">
                      <PlaylistAddVideoListModal {...workPlaylist} />
                      <PlaylistAddVideoModal {...workPlaylist} />
                      <PlaylistSearchModal
                        opened={workPlaylist.searchVideoOpened}
                        close={workPlaylist.closeSearchVideo}
                        searchVideos={workPlaylist.searchVideos}
                        searchResults={workPlaylist.searchResults}
                        isSearching={workPlaylist.isSearching}
                        nextPageToken={workPlaylist.nextPageToken}
                        addVideoToPlaylist={workPlaylist.addVideoToPlaylist}
                        activePlaylist={workPlaylist.activePlaylist}
                      />
                      <PlaylistAddModal {...workPlaylist} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <PlaylistTabs 
                      {...workPlaylist} 
                      removePlaylist={removePlaylist} 
                      renamePlaylist={workPlaylist.renamePlaylist}
                      isWorking={isWorking} 
                      tabMode="work" 
                      isMinimal={isCinemaMode}
                      openSearchVideo={workPlaylist.openSearchVideo}
                    />
                  </div>
                </div>
              </Tabs.Panel>
              
              <Tabs.Panel value="break" className="flex-1 overflow-hidden h-full">
                <div className={`my-4 h-full flex flex-col ${isCinemaMode ? "overflow-hidden" : "overflow-y-auto"}`}>
                  {!isCinemaMode && (
                    <div className="flex-shrink-0">
                      <PlaylistAddVideoListModal {...breakPlaylist} />
                      <PlaylistAddVideoModal {...breakPlaylist} />
                      <PlaylistSearchModal
                        opened={breakPlaylist.searchVideoOpened}
                        close={breakPlaylist.closeSearchVideo}
                        searchVideos={breakPlaylist.searchVideos}
                        searchResults={breakPlaylist.searchResults}
                        isSearching={breakPlaylist.isSearching}
                        nextPageToken={breakPlaylist.nextPageToken}
                        addVideoToPlaylist={breakPlaylist.addVideoToPlaylist}
                        activePlaylist={breakPlaylist.activePlaylist}
                      />
                      <PlaylistAddModal {...breakPlaylist} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <PlaylistTabs 
                      {...breakPlaylist} 
                      removePlaylist={removePlaylist} 
                      renamePlaylist={breakPlaylist.renamePlaylist}
                      isWorking={isWorking} 
                      tabMode="break"
                      isMinimal={isCinemaMode}
                      openSearchVideo={breakPlaylist.openSearchVideo}
                    />
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
