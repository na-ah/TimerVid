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
import { useAtomValue } from "jotai";
import { isTimerVisibleAtom } from "@/atoms/atoms";

export default function TimersWithControllerContainer({ isAmbientMode = false }) {
  const isTimerVisible = useAtomValue(isTimerVisibleAtom);
  const { controller } = usePlayer();
  const { resetStatus } = useContext(PlaylistContext);
  const {
    currentTimer,
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

  if (!isTimerVisible) return null;

  return (
    <>
      <div className={isAmbientMode ? "text-white" : ""}>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className={`font-bold ${isAmbientMode ? "text-white/90 text-lg" : "text-center"}`}>
              {totalCycleCount} / {totalCycle}
            </div>
            <Progress
              size="md"
              radius="xl"
              value={(totalCycleCount / totalCycle) * 100}
              color={isAmbientMode ? "indigo.3" : "blue"}
              bg={isAmbientMode ? "rgba(255, 255, 255, 0.1)" : undefined}
            />
          </div>
          <div className="flex justify-end pl-4">
            <button
              className={`p-2 rounded-full transition-all ${isAmbientMode ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}
              onClick={() => {
                const isAnyTrue = [workTimer, breakTimer, longBreakTimer].some(
                  (timer) => timer.showSetting === true
                );
                [workTimer, breakTimer, longBreakTimer].forEach((timer) =>
                  timer.setShowSetting(!isAnyTrue)
                );
              }}
            >
              <IoMdSettings className={`text-2xl ${isAmbientMode ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-zinc-800"}`} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <TimerContainer
            timer={workTimer}
            label={"work"}
            totalCycle={totalCycle}
            setTotalCycle={setTotalCycle}
            color={isAmbientMode ? "#818cf8" : "#3e98c7"}
            isAmbientMode={isAmbientMode}
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
            color={isAmbientMode ? "#2dd4bf" : "#0d9488"}
            isAmbientMode={isAmbientMode}
          />
          <TimerContainer
            timer={longBreakTimer}
            longBreakCycle={longBreakCycle}
            setLongBreakCycle={setLongBreakCycle}
            label={"long"}
            color={isAmbientMode ? "#fb7185" : "#f43f5e"}
            isAmbientMode={isAmbientMode}
          />
        </div>
        
        <Button
          id="tutorial1-1"
          fullWidth
          size={isAmbientMode ? "xl" : "md"}
          radius="md"
          className={`shadow-lg mt-6 mb-4 font-bold text-lg tracking-wide ${isAmbientMode ? "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white" : ""}`}
          color={isAmbientMode ? undefined : "grape"}
          onClick={() => {
            startTimer();
          }}
        >
          {workTimer.isRunning || breakTimer.isRunning || longBreakTimer.isRunning ? "Pause" : "Play"}
        </Button>
        
        <div className="w-full gap-3 grid grid-cols-3">
          <button
            className={`flex justify-center items-center gap-2 shadow-md rounded-xl py-3 font-medium transition-all ${isAmbientMode ? "bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white/90 hover:text-white" : "bg-white hover:bg-zinc-50"}`}
            onClick={() => {
              clearTimer();
              resetStatus();
            }}
          >
            <BiReset size={20} /> Reset
          </button>
          <button
            className={`flex justify-center items-center gap-2 shadow-md rounded-xl py-3 font-medium transition-all ${isAmbientMode ? "bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white/90 hover:text-white" : "bg-white hover:bg-zinc-50"}`}
            onClick={rewindTimer}
          >
            <TbPlayerTrackPrevFilled size={20} /> Rewind
          </button>
          <button
            id="tutorial4-1"
            className={`flex justify-center items-center gap-2 shadow-md rounded-xl py-3 font-medium transition-all ${isAmbientMode ? "bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white/90 hover:text-white" : "bg-white hover:bg-zinc-50"}`}
            onClick={skipTimer}
          >
            <TbPlayerTrackNextFilled size={20} /> Skip
          </button>
        </div>
      </div>
    </>
  );
}
