import { useContext, useMemo } from "react";
import TimerContainer from "./timer/timerContainer";
import { TimerContext } from "../../../context/timerProvider";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { BiReset } from "react-icons/bi";
import { Button, Progress } from "@mantine/core";
import { IoMdSettings } from "react-icons/io";
import usePlayer from "@/hooks/usePlayer";
import { PlaylistContext } from "@/context/playlistProvider";

export default function TimersWithControllerContainer() {
  const { controller } = usePlayer();
  const { resetStatus } = useContext(PlaylistContext);
  const {
    workTimer,
    breakTimer,
    longBreakTimer,
    startTimer,
    clearTimer,
    skipTimer,
    rewindTimer,
    totalCycle,
    setTotalCycle,
    totalCycleCount,
    longBreakCycle,
    setLongBreakCycle,
  } = useContext(TimerContext);

  const breakCount = useMemo(() => {
    return totalCycle - Math.floor(totalCycle / longBreakCycle);
  }, [longBreakCycle, totalCycle]);

  const longBreakCount = useMemo(() => {
    return Math.floor(totalCycle / longBreakCycle);
  }, [longBreakCycle, totalCycle]);

  const workTimerTotalTime = useMemo(() => {
    return workTimer.totalTime * totalCycle;
  }, [totalCycle, workTimer.totalTime]);

  const breakTimerTotalTime = useMemo(() => {
    return breakTimer.totalTime * breakCount;
  }, [breakCount, breakTimer.totalTime]);

  const longBreakTimerTotalTime = useMemo(() => {
    return longBreakTimer.totalTime * longBreakCount;
  }, [longBreakCount, longBreakTimer.totalTime]);

  const totalRequiredTime = useMemo(() => {
    return workTimerTotalTime + breakTimerTotalTime + longBreakTimerTotalTime;
  }, [workTimerTotalTime, breakTimerTotalTime, longBreakTimerTotalTime]);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="my-3 w-full grid grid-cols-[10%_1fr] items-center">
            <div className="text-center">
              {totalCycleCount}/{totalCycle}
            </div>
            <Progress
              size="xs"
              value={(totalCycleCount / totalCycle) * 100}
            />
          </div>
          <div className="flex justify-end basis-1/12">
            <button
              onClick={() => {
                const isAnyTrue = [workTimer, breakTimer, longBreakTimer].some(
                  (timer) => timer.showSetting === true
                );
                [workTimer, breakTimer, longBreakTimer].forEach((timer) =>
                  timer.setShowSetting(!isAnyTrue)
                );
              }}
            >
              <IoMdSettings className="text-xl text-zinc-500 hover:text-zinc-800" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <TimerContainer
            timer={workTimer}
            label={"work"}
            totalCycle={totalCycle}
            setTotalCycle={setTotalCycle}
            color={"#3e98c7"}
          />
          <TimerContainer
            timer={breakTimer}
            label={"break"}
            longBreakCycle={longBreakCycle}
            longBreakCount={longBreakCount}
            totalCycle={totalCycle}
            workTimerTotalTime={workTimerTotalTime}
            breakTimerTotalTime={breakTimerTotalTime}
            longBreakTimerTotalTime={longBreakTimerTotalTime}
            totalRequiredTime={totalRequiredTime}
            breakCount={breakCount}
            color={"#0d9488"}
          />
          <TimerContainer
            timer={longBreakTimer}
            longBreakCycle={longBreakCycle}
            setLongBreakCycle={setLongBreakCycle}
            label={"long"}
            color={"#f43f5e"}
          />
        </div>
        <Button
          id="tutorial1-1"
          fullWidth
          className="shadow-md my-3"
          color="grape"
          onClick={() => {
            startTimer();
            controller({ type: "play/pause" });
          }}
        >
          play / pause
        </Button>
        <div className="w-full mt-3 gap-3 grid grid-cols-3">
          <button
            className="flex justify-center items-center gap-1 shadow-md  rounded-md"
            onClick={() => {
              clearTimer();
              resetStatus();
            }}
          >
            <BiReset /> Reset
          </button>
          <button
            className="flex justify-center items-center gap-1 shadow-md  rounded-md"
            onClick={rewindTimer}
          >
            <TbPlayerTrackPrevFilled /> Rewind
          </button>
          <button
            id="tutorial4-1"
            className="flex justify-center items-center gap-1 shadow-md  rounded-md"
            onClick={skipTimer}
          >
            <TbPlayerTrackNextFilled /> Skip
          </button>
        </div>
      </div>
    </>
  );
}
