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
                  <div className={`transition-all duration-500 pointer-events-auto flex flex-col ${isAmbientMode ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 w-[90%] max-w-2xl' : ''}`}>
                    {isAmbientMode && (
                      <div className="flex justify-end mb-4">
                        <Button
                          leftSection={<FaCompress size={14} />}
                          variant="subtle"
                          color="gray"
                          onClick={() => setIsAmbientMode(false)}
                          className="text-zinc-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
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

                {!isAmbientMode && (
                  <div className={`pointer-events-auto flex-1 flex flex-col`}>
                    <PlaylistContainer
                      isCinemaMode={isCinemaMode}
                      setIsCinemaMode={setIsCinemaMode}
                    >
                      <PlayerContainer
                        isCinemaMode={isCinemaMode}
                        setIsCinemaMode={setIsCinemaMode}
                        isAmbientMode={false}
                      />
                    </PlaylistContainer>
                  </div>
                )}

                {/* Ambient Mode Background Player Container */}
                {isAmbientMode && (
                  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dimming overlay */}
                    <div className="absolute inset-[-10%] z-0 blur-[8px] scale-110 pointer-events-none">
                       <PlayerContainer
                          isCinemaMode={false}
                          setIsCinemaMode={setIsCinemaMode}
                          isAmbientMode={true}
                        />
                    </div>
                  </div>
                )}
              </PlaylistProvider>
            </div>
          </div>
        </div>
      </MantineProvider>
    </>
  );
}
