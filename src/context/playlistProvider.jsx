import { createContext, useState } from "react";
import usePlaylist from "../hooks/usePlaylist";
import { useAtomValue, useSetAtom } from "jotai";
import { modeAtom, playerAtom, resumeTimeAtom } from "../atoms/atoms";
import usePlayer from "@/hooks/usePlayer";

export const PlaylistContext = createContext();

export default function PlaylistProvider({ children }) {
  const setMode = useSetAtom(modeAtom);
  const setResumeTime = useSetAtom(resumeTimeAtom);
  const player = useAtomValue(playerAtom);
  const workPlaylist = usePlaylist("work");
  const breakPlaylist = usePlaylist("break");
  const [isWorking, setIsWorking] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState("work");
  const currentVideoId = isWorking
    ? workPlaylist.currentVideoId
    : breakPlaylist.currentVideoId;

  const switchStatus = () => {
    setIsWorking((prev) => {
      const newIsWorking = !prev;
      newIsWorking ? setSelectedPlaylist("work") : setSelectedPlaylist("break");
      return newIsWorking;
    });
    setResumeTime(player.getCurrentTime());
    setMode((prev) => (prev === "work" ? "break" : "work"));
  };

  const resetStatus = () => {
    setIsWorking(true);
    setSelectedPlaylist("work");
    setResumeTime(0);
    setMode("work");
  };

  const nextVideo = () => {
    setResumeTime(0);
    isWorking ? workPlaylist.nextVideo() : breakPlaylist.nextVideo();
  };

  const prevVideo = () => {
    setResumeTime(0);
    isWorking ? workPlaylist.prevVideo() : breakPlaylist.prevVideo();
  };

  const removePlaylist = () => {
    isWorking ? workPlaylist.removePlaylist() : breakPlaylist.removePlaylist();
  };

  return (
    <>
      <PlaylistContext.Provider
        value={{
          currentVideoId,
          workPlaylist,
          breakPlaylist,
          isWorking,
          setIsWorking,
          switchStatus,
          resetStatus,
          selectedPlaylist,
          setSelectedPlaylist,
          nextVideo,
          prevVideo,
          removePlaylist,
        }}
      >
        {children}
      </PlaylistContext.Provider>
    </>
  );
}
