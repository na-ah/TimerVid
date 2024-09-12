import { MantineProvider } from "@mantine/core";
import Header from "../Organisms/header/Header";
import TimersWithControllerContainer from "../Organisms/timerWithController/timersWithControllerContainer";
import PlaylistProvider from "@/context/playlistProvider";
import TimerProvider from "@/context/timerProvider";
import PlaylistContainer from "../Organisms/playlist/playlistContainer";
import PlayerContainer from "../Organisms/player/playerContainer";

export default function TimerVid() {
  return (
    <>
      <MantineProvider>
        <div className="min-h-dvh">
          <Header />
          <section className="mx-auto w-fit">
            <div className="w-[480px] md:w-[768px] xl:w-[1280px] flex flex-col gap-3 px-5">
              <PlaylistProvider>
                <TimerProvider>
                  <TimersWithControllerContainer />
                </TimerProvider>
                <PlaylistContainer>
                  <PlayerContainer />
                </PlaylistContainer>
              </PlaylistProvider>
            </div>
          </section>
        </div>
      </MantineProvider>
    </>
  );
}
