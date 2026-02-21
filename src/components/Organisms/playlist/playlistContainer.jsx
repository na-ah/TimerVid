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

  return (
    <>
      <Modal opened={opened} onClose={close} title="プレイリスト切り替え" centered>
        <div className="flex flex-col gap-4">
          <Button 
            variant={selectedPlaylist === 'work' ? "filled" : "light"} 
            onClick={() => { setSelectedPlaylist('work'); close(); }}
            fullWidth
          >
            Work Playlist
          </Button>
          <Button 
            variant={selectedPlaylist === 'break' ? "filled" : "light"} 
            onClick={() => { setSelectedPlaylist('break'); close(); }}
            fullWidth
          >
            Break Playlist
          </Button>
        </div>
      </Modal>

      <div className={`flex flex-col md:flex-row gap-6 w-full items-start transition-all duration-500 ease-in-out ${isCinemaMode ? "h-[calc(100vh-140px)]" : ""}`}>
        {/* Left Column: Player & Current Info */}
        <div
          className={`flex flex-col w-full h-full transition-all duration-500 ease-in-out ${
            isCinemaMode ? "md:w-[70%]" : "md:w-[20%]"
          }`}
        >
          <div className="mb-2 flex justify-end">
            <Tooltip label={isCinemaMode ? "リスト表示モード" : "シアターモード"} position="left" withArrow>
              <ActionIcon
                variant="light"
                color="gray"
                onClick={() => setIsCinemaMode(!isCinemaMode)}
                size="lg"
              >
                {isCinemaMode ? <FaCompress size={20} /> : <FaExpand size={20} />}
              </ActionIcon>
            </Tooltip>
          </div>

          <div className="mb-4">
            {isWorking ? (
              <PlaylistInfo {...workPlaylist} isMinimal={!isCinemaMode} />
            ) : (
              <PlaylistInfo {...breakPlaylist} isMinimal={!isCinemaMode} />
            )}
          </div>
          
          <div className="w-full shadow-lg rounded-lg overflow-hidden flex-shrink-0">
            {children}
          </div>
        </div>

        {/* Right Column: Playlist Selection */}
        <div
          className={`w-full h-full flex flex-col transition-all duration-500 ease-in-out ${
            isCinemaMode ? "md:w-[30%]" : "md:w-[80%]"
          }`}
        >
          {isCinemaMode && (
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-bold text-lg truncate">
                {selectedPlaylist === 'work' ? "Work Playlist" : "Break Playlist"}
              </h3>
              <ActionIcon variant="subtle" onClick={open}>
                <FaList />
              </ActionIcon>
            </div>
          )}

          <Tabs
            className={`w-full ${isCinemaMode ? "flex-1 overflow-hidden flex flex-col" : ""}`}
            defaultValue={isWorking ? "work" : "break"}
            value={selectedPlaylist}
            onChange={setSelectedPlaylist}
          >
            {!isCinemaMode && (
              <Tabs.List className="flex items-center w-full flex-wrap">
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

            <Tabs.Panel value="work" className={isCinemaMode ? "flex-1 overflow-hidden" : ""}>
              <div className={`my-4 ${isCinemaMode ? "h-full overflow-y-auto" : ""}`}>
                {!isCinemaMode && (
                  <>
                    <PlaylistAddVideoListModal {...workPlaylist} />
                    <PlaylistAddVideoModal {...workPlaylist} />
                    <PlaylistAddModal {...workPlaylist} />
                  </>
                )}
                <PlaylistTabs 
                  {...workPlaylist} 
                  removePlaylist={removePlaylist} 
                  isWorking={isWorking} 
                  tabMode="work" 
                  isMinimal={isCinemaMode}
                />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="break" className={isCinemaMode ? "flex-1 overflow-hidden" : ""}>
              <div className={`my-4 ${isCinemaMode ? "h-full overflow-y-auto" : ""}`}>
                {!isCinemaMode && (
                  <>
                    <PlaylistAddVideoListModal {...breakPlaylist} />
                    <PlaylistAddVideoModal {...breakPlaylist} />
                    <PlaylistAddModal {...breakPlaylist} />
                  </>
                )}
                <PlaylistTabs 
                  {...breakPlaylist} 
                  removePlaylist={removePlaylist} 
                  isWorking={isWorking} 
                  tabMode="break"
                  isMinimal={isCinemaMode}
                />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </>
  );
}
