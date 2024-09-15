import { MantineProvider } from "@mantine/core";
import Header from "../Organisms/header/Header";
import TimersWithControllerContainer from "../Organisms/timerWithController/timersWithControllerContainer";
import PlaylistProvider from "@/context/playlistProvider";
import TimerProvider from "@/context/timerProvider";
import PlaylistContainer from "../Organisms/playlist/playlistContainer";
import PlayerContainer from "../Organisms/player/playerContainer";
import TutorialContainer from "../Organisms/tutorial/tutorialContainer";
import { useState } from "react";
import { Toaster } from "../ui/toaster";

export default function TimerVid() {
  const [isShowTutorial, setIsShowTutorial] = useState(true);
  return (
    <>
      <MantineProvider>
        <div className="min-h-dvh min-w-[240px] w-full sm:w-[640px] md:w-[768px] xl:w-[1280px] mx-auto">
          <Toaster />
          <Header setIsShowTutorial={setIsShowTutorial} />
          <TutorialContainer
            isShowTutorial={isShowTutorial}
            setIsShowTutorial={setIsShowTutorial}
          />
          <PlaylistProvider>
            <TimerProvider>
              <TimersWithControllerContainer />
            </TimerProvider>
            <PlaylistContainer>
              <PlayerContainer />
            </PlaylistContainer>
          </PlaylistProvider>
        </div>
      </MantineProvider>
    </>
  );
}
