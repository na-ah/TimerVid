import { useContext, useMemo, useState } from "react";
import PlaylistTabs from "../../Molecules/playlist/playlistTabs";
import { PlaylistContext } from "../../../context/playlistProvider";
import PlaylistInfo from "../../Molecules/playlist/playlistInfo";
import PlaylistAddVideoModal from "../../Molecules/playlist/playlistAddVideoModal";
import { Tabs } from "@mantine/core";
import { GoArrowSwitch } from "react-icons/go";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import PlaylistAddVideoListModal from "../../Molecules/playlist/playlistAddVideoListModal";
import { FaMinus, FaPlus } from "react-icons/fa6";
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
          <Tabs.List>
            <Tabs.Tab value="work">work playlist</Tabs.Tab>
            <Tabs.Tab value="break">
              <span id="tutorial4-2">break playlist</span>
            </Tabs.Tab>
            <div className="ml-auto flex gap-3">
              <GoArrowSwitch
                className="cursor-pointer"
                onClick={switchStatus}
              />
              <TbPlayerTrackPrevFilled
                className="cursor-pointer"
                onClick={prevVideo}
              />
              <TbPlayerTrackNextFilled
                className="cursor-pointer"
                onClick={nextVideo}
              />
              <FaPlus
                id="tutorial2-1"
                className={`${"cursor-pointer"}`}
                onClick={() => {
                  selectedPlaylist == "work"
                    ? workPlaylist.openAddPlaylist()
                    : breakPlaylist.openAddPlaylist();
                }}
              />
              <FaMinus
                className="cursor-pointer"
                onClick={() => {
                  removePlaylist();
                }}
              />
            </div>
          </Tabs.List>
          <Tabs.Panel value="work">
            <div className="my-8">
              <PlaylistAddVideoListModal {...workPlaylist} />
              <PlaylistAddVideoModal {...workPlaylist} />
              <PlaylistAddModal {...workPlaylist} />
              <PlaylistTabs {...workPlaylist} />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="break">
            <div className="my-8">
              <PlaylistAddVideoListModal {...breakPlaylist} />
              <PlaylistAddVideoModal {...breakPlaylist} />
              <PlaylistAddModal {...breakPlaylist} />
              <PlaylistTabs {...breakPlaylist} />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
