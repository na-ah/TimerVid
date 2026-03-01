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
  const [isAmbientMode, setIsAmbientMode] = useState(false);

  return (
    <>
      <MantineProvider forceColorScheme={isCinemaMode || isAmbientMode ? "dark" : "light"}>
        <div className={`min-h-dvh min-w-[240px] w-full transition-all duration-700 ease-in-out relative ${ 
          isCinemaMode || isAmbientMode
            ? "bg-[#0f1115] text-zinc-100 dark"
            : "bg-white text-zinc-900"
        }`}>

          <div className={`max-w-[1920px] mx-auto h-dvh flex flex-col relative z-10`}>
            <Toaster />
            {!isCinemaMode && !isAmbientMode && (
              <div className="pointer-events-auto">
                <Header 
                  setIsShowTutorial={setIsShowTutorial} 
                  isAmbientMode={isAmbientMode}
                  setIsAmbientMode={setIsAmbientMode}
                />
              </div>
            )}

            <div className={`flex-1 flex flex-col ${isCinemaMode ? "p-4 sm:p-6" : isAmbientMode ? "p-0" : "px-4 py-4"}`}>  
              {!isCinemaMode && !isAmbientMode && (
                <div className="pointer-events-auto">
                  <TutorialContainer
                    isShowTutorial={isShowTutorial}
                    setIsShowTutorial={setIsShowTutorial}
                  />
                </div>
              )}
              <PlaylistProvider>
                {!isCinemaMode && !isAmbientMode && (
                  <div className="transition-all duration-500 pointer-events-auto flex flex-col z-20">
                    <TimerProvider>
                      <TimersWithControllerContainer />
                    </TimerProvider>
                  </div>
                )}

                {/* Main Player/Playlist Container */}
                <div className={`pointer-events-auto transition-all duration-700 ${isAmbientMode ? 'fixed inset-0 z-50 bg-black flex flex-col' : 'flex-1 flex flex-col'}`}>
                  <PlaylistContainer
                    isCinemaMode={isCinemaMode}
                    setIsCinemaMode={setIsCinemaMode}
                    isAmbientMode={isAmbientMode}
                  >
                    <PlayerContainer
                      isCinemaMode={isCinemaMode}
                      setIsCinemaMode={setIsCinemaMode}
                      isAmbientMode={isAmbientMode}
                      setIsAmbientMode={setIsAmbientMode}
                    />
                  </PlaylistContainer>
                </div>
              </PlaylistProvider>
            </div>
          </div>
        </div>
      </MantineProvider>
    </>
  );
}
