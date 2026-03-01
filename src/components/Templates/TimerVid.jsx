import { MantineProvider, Button } from "@mantine/core";
import Header from "../Organisms/header/Header";
import TimersWithControllerContainer from "../Organisms/timerWithController/timersWithControllerContainer";
import PlaylistProvider from "@/context/playlistProvider";
import TimerProvider from "@/context/timerProvider";
import PlaylistContainer from "../Organisms/playlist/playlistContainer";
import PlayerContainer from "../Organisms/player/playerContainer";
import TutorialContainer from "../Organisms/tutorial/tutorialContainer";
import { useState } from "react";
import { Toaster } from "../ui/toaster";
import { FaCompress } from "react-icons/fa6";

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

          <div className={`max-w-[1920px] mx-auto h-dvh flex flex-col relative z-10 ${isAmbientMode ? 'pointer-events-none' : ''}`}>
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
                {!isCinemaMode && (
                  <div className={`transition-all duration-500 pointer-events-auto flex flex-col z-20 ${isAmbientMode ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#16191e]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 w-[95%] max-w-3xl' : ''}`}>
                    {isAmbientMode && (
                      <div className="flex justify-end mb-6">
                        <Button
                          leftSection={<FaCompress size={14} />}
                          variant="light"
                          color="gray"
                          onClick={() => setIsAmbientMode(false)}
                          className="text-zinc-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg bg-white/5"
                        >
                          アンビエントモードを終了
                        </Button>
                      </div>
                    )}
                    <TimerProvider>
                      <TimersWithControllerContainer />
                    </TimerProvider>
                  </div>
                )}

                {/* We render ONLY ONE PlaylistContainer/PlayerContainer. In ambient mode, it's pushed to the background. */}
                <div className={`pointer-events-auto ${isAmbientMode ? 'absolute inset-0 -z-10 overflow-hidden scale-[1.15] blur-[8px]' : 'flex-1 flex flex-col'}`}>
                  {isAmbientMode && <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />}
                  
                  <PlaylistContainer
                    isCinemaMode={isCinemaMode}
                    setIsCinemaMode={setIsCinemaMode}
                  >
                    <PlayerContainer
                      isCinemaMode={isCinemaMode}
                      setIsCinemaMode={setIsCinemaMode}
                      isAmbientMode={isAmbientMode}
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
