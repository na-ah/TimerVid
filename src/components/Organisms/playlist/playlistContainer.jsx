import { useContext, useState } from "react";
import PlaylistTabs from "../../Molecules/playlist/playlistTabs";
import { PlaylistContext } from "../../../context/playlistProvider";
import PlaylistInfo from "../../Molecules/playlist/playlistInfo";
import PlaylistAddVideoModal from "../../Molecules/playlist/playlistAddVideoModal";
import { Tabs, ActionIcon, Tooltip, Group, Button } from "@mantine/core";
import { GoArrowSwitch } from "react-icons/go";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import PlaylistAddVideoListModal from "../../Molecules/playlist/playlistAddVideoListModal";
import { FaPlus, FaExpand, FaCompress } from "react-icons/fa6";
import PlaylistAddModal from "../../Molecules/playlist/playlistAddModal";

export default function PlaylistContainer({ children }) {
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

  const [isCinemaMode, setIsCinemaMode] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 w-full items-start">
        {/* Left Column: Player & Current Info */}
        <div
          className={`flex flex-col w-full transition-all duration-500 ease-in-out ${
            isCinemaMode ? "md:w-4/5" : "md:w-1/5"
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
          
          <div className="w-full shadow-lg rounded-lg overflow-hidden">
            {children}
          </div>
        </div>

        {/* Right Column: Playlist Selection */}
        <div
          className={`w-full transition-all duration-500 ease-in-out ${
            isCinemaMode ? "md:w-1/5" : "md:w-4/5"
          }`}
        >
          <Tabs
            className="w-full"
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

            <Tabs.Panel value="work">
              <div className="my-4">
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
            <Tabs.Panel value="break">
              <div className="my-4">
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
