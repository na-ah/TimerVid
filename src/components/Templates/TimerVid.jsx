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
                  <div className={`transition-all duration-500 pointer-events-auto flex flex-col z-20 ${isAmbientMode ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 w-[95%] max-w-3xl text-white' : ''}`}>
                    {isAmbientMode && (
                      <div className="flex justify-end mb-6">
                        <Button
                          leftSection={<FaCompress size={14} />}
                          variant="subtle"
                          color="gray"
                          onClick={() => setIsAmbientMode(false)}
                          className="text-white hover:bg-white/20 transition-colors rounded-lg bg-white/10"
                        >
                          アンビエントモードを終了
                        </Button>
                      </div>
                    )}
                    <div className={isAmbientMode ? "[&_*]:!text-white [&_.bg-white]:!bg-white/10" : ""}>
                       <TimerProvider>
                         <TimersWithControllerContainer isAmbientMode={isAmbientMode} />
                       </TimerProvider>
                    </div>
                  </div>
                )}

                {/* We render ONLY ONE PlaylistContainer/PlayerContainer. In ambient mode, it's pushed to the background. */}
                <div className={`pointer-events-auto ${isAmbientMode ? 'absolute inset-0 -z-10 overflow-hidden scale-[1.05] blur-[12px]' : 'flex-1 flex flex-col'}`}>
                  {isAmbientMode && <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />}
                  
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
