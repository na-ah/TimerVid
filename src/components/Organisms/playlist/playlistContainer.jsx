import { useContext, useState } from "react";
import PlaylistTabs from "../../Molecules/playlist/playlistTabs";
import { PlaylistContext } from "../../../context/playlistProvider";
import PlaylistInfo from "../../Molecules/playlist/playlistInfo";
import PlaylistAddVideoModal from "../../Molecules/playlist/playlistAddVideoModal";
import { Tabs, ActionIcon, Tooltip, Group, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GoArrowSwitch } from "react-icons/go";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import PlaylistAddVideoListModal from "../../Molecules/playlist/playlistAddVideoListModal";
import { FaPlus, FaExpand, FaCompress, FaList } from "react-icons/fa6";
import PlaylistAddModal from "../../Molecules/playlist/playlistAddModal";

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
  } = useContext(PlaylistContext);

  const [opened, { open, close }] = useDisclosure(false);
  const activeContext = selectedPlaylist === 'work' ? workPlaylist : breakPlaylist;

  return (
    <>
      <Modal opened={opened} onClose={close} title="プレイリスト選択" centered scrollAreaComponent={false}>
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto p-1">
          {activeContext.playlists.map((pl, i) => (
            <Button 
              key={i}
              variant={activeContext.activePlaylist === pl.title ? "filled" : "light"} 
              onClick={() => { activeContext.setActivePlaylist(pl.title); close(); }}
              fullWidth
              className="justify-start h-auto py-3 flex-shrink-0 min-h-[60px]"
            >
              <div className="flex flex-col items-start truncate w-full">
                <span className="font-bold text-sm truncate w-full text-left">{pl.title}</span>
                <span className="text-xs opacity-70">{pl.videoIds.length} videos</span>
              </div>
            </Button>
          ))}
        </div>
      </Modal>

      <div className={`flex flex-col w-full transition-all duration-300 ${isCinemaMode ? "h-[calc(100dvh-20px)]" : ""}`}>
        
        {/* Cinema Mode Header */}
        {isCinemaMode && (
          <div className="flex items-center justify-between mb-4 w-full px-2 flex-shrink-0">
            <Button 
              leftSection={<FaCompress />} 
              variant="light" 
              color="gray" 
              onClick={() => setIsCinemaMode(false)}
            >
              通常モードへ戻る
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg hidden sm:inline-block max-w-[200px] truncate">
                {activeContext.activePlaylist}
              </span>
              <Button 
                leftSection={<FaList />} 
                variant="filled" 
                color="indigo" 
                onClick={open}
                size="sm"
              >
                リスト選択
              </Button>
            </div>
          </div>
        )}

        <div className={`flex w-full items-start flex-1 overflow-hidden transition-all duration-500 ease-in-out ${isCinemaMode ? "flex-col md:flex-row gap-6" : "flex-col gap-4"}`}>
          {/* Left Column: Player & Current Info */}
          <div
            className={`flex flex-col w-full transition-all duration-500 ease-in-out ${
              isCinemaMode ? "h-full md:w-[70%]" : "shrink-0"
            }`}
          >
            {/* Player Container */}
            <div className={`w-full shadow-lg rounded-xl overflow-hidden flex-shrink-0 ${isCinemaMode ? "h-full flex flex-col" : ""}`}>
              {children}
            </div>
          </div>

          {/* Right Column: Playlist Selection */}
          <div
            className={`w-full flex flex-col transition-all duration-500 ease-in-out ${
              isCinemaMode ? "h-full md:w-[30%]" : "flex-1 overflow-hidden"
            }`}
          >
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

                    <Tooltip label="シアターモード" position="bottom" withArrow>
                      <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={() => setIsCinemaMode(true)}
                        size="lg"
                        className="ml-2"
                      >
                        <FaExpand size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </Tabs.List>
              )}

              <Tabs.Panel value="work" className="flex-1 overflow-hidden h-full">
                <div className={`my-4 h-full flex flex-col ${isCinemaMode ? "overflow-hidden" : "overflow-y-auto"}`}>
                  {!isCinemaMode && (
                    <div className="flex-shrink-0">
                      <PlaylistAddVideoListModal {...workPlaylist} />
                      <PlaylistAddVideoModal {...workPlaylist} />
                      <PlaylistAddModal {...workPlaylist} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <PlaylistTabs 
                      {...workPlaylist} 
                      removePlaylist={removePlaylist} 
                      isWorking={isWorking} 
                      tabMode="work" 
                      isMinimal={isCinemaMode}
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
                      <PlaylistAddModal {...breakPlaylist} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <PlaylistTabs 
                      {...breakPlaylist} 
                      removePlaylist={removePlaylist} 
                      isWorking={isWorking} 
                      tabMode="break"
                      isMinimal={isCinemaMode}
                    />
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
