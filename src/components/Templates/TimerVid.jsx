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
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  return (
    <>
      <MantineProvider forceColorScheme={isCinemaMode ? "dark" : "light"}>
        <div className={`min-h-dvh min-w-[240px] w-full transition-all duration-700 ease-in-out ${
          isCinemaMode 
            ? "bg-[#0f1115] text-zinc-100 dark" 
            : "bg-white text-zinc-900"
        }`}>
          <div className="max-w-[1920px] mx-auto h-dvh flex flex-col">
            <Toaster />
            {!isCinemaMode && (
              <Header setIsShowTutorial={setIsShowTutorial} />
            )}
            
            <div className={`flex-1 flex flex-col ${isCinemaMode ? "p-4 sm:p-6" : "px-4 py-4"}`}>
              {!isCinemaMode && (
                <TutorialContainer
                  isShowTutorial={isShowTutorial}
                  setIsShowTutorial={setIsShowTutorial}
                />
              )}
              <PlaylistProvider>
                {!isCinemaMode && (
                  <TimerProvider>
                    <TimersWithControllerContainer />
                  </TimerProvider>
                )}
                <PlaylistContainer 
                  isCinemaMode={isCinemaMode} 
                  setIsCinemaMode={setIsCinemaMode}
                >
                  <PlayerContainer 
                    isCinemaMode={isCinemaMode} 
                    setIsCinemaMode={setIsCinemaMode}
                  />
                </PlaylistContainer>
              </PlaylistProvider>
            </div>
          </div>
        </div>
      </MantineProvider>
    </>
  );
}
