import { useContext, useMemo, useState } from "react";
import PlaylistTabs from "../../Molecules/playlist/playlistTabs";
import { PlaylistContext } from "../../../context/playlistProvider";
import PlaylistInfo from "../../Molecules/playlist/playlistInfo";
import PlaylistAddVideoModal from "../../Molecules/playlist/playlistAddVideoModal";
import { Tabs, ActionIcon, Tooltip, Group, Button } from "@mantine/core";
import { GoArrowSwitch } from "react-icons/go";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import PlaylistAddVideoListModal from "../../Molecules/playlist/playlistAddVideoListModal";
import { FaPlus } from "react-icons/fa6";
import PlaylistAddModal from "../../Molecules/playlist/playlistAddModal";

export default function PlaylistContainer({ children }) {
  const { workPlaylist } = useContext(PlaylistContext);
  const { breakPlaylist } = useContext(PlaylistContext);
  const {
    isWorking,
    setIsWorking,
    switchStatus,
    selectedPlaylist,
    setSelectedPlaylist,
    nextVideo,
    prevVideo,
    removePlaylist,
  } = useContext(PlaylistContext);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="my-5">
          {isWorking ? (
            <PlaylistInfo {...workPlaylist} />
          ) : (
            <PlaylistInfo {...breakPlaylist} />
          )}
        </div>
        {children}
        <Tabs
          className="w-full my-5"
          defaultValue={isWorking ? "work" : "break"}
          value={selectedPlaylist}
          onChange={setSelectedPlaylist}
        >
          <Tabs.List className="flex items-center w-full">
            <Tabs.Tab value="work">work playlist</Tabs.Tab>
            <Tabs.Tab value="break">
              <span id="tutorial4-2">break playlist</span>
            </Tabs.Tab>
            <div className="ml-auto flex items-center gap-4 px-2 pb-2">
              <Group spacing="xs" className="hidden sm:flex">
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
                size="sm"
                onClick={() => {
                  selectedPlaylist == "work"
                    ? workPlaylist.openAddPlaylist()
                    : breakPlaylist.openAddPlaylist();
                }}
              >
                新規リスト
              </Button>
            </div>
          </Tabs.List>
          <Tabs.Panel value="work">
            <div className="my-8">
              <PlaylistAddVideoListModal {...workPlaylist} />
              <PlaylistAddVideoModal {...workPlaylist} />
              <PlaylistAddModal {...workPlaylist} />
              <PlaylistTabs {...workPlaylist} removePlaylist={removePlaylist} isWorking={isWorking} tabMode="work" />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="break">
            <div className="my-8">
              <PlaylistAddVideoListModal {...breakPlaylist} />
              <PlaylistAddVideoModal {...breakPlaylist} />
              <PlaylistAddModal {...breakPlaylist} />
              <PlaylistTabs {...breakPlaylist} removePlaylist={removePlaylist} isWorking={isWorking} tabMode="break" />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
