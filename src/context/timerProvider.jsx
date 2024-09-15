import { createContext, useContext, useEffect, useState } from "react";
import useTimer from "../hooks/useTimer";
import { PlaylistContext } from "./playlistProvider";
import useSound from "use-sound";
import countdownSfx from "../assets/countdown.mp3";
import fanfareSfx from "../assets/fanfare.mp3";
import { useAtomValue } from "jotai";
import { playerAtom } from "../atoms/atoms";
import usePlayer from "@/hooks/usePlayer";
import { toast } from "@/hooks/use-toast";

export const TimerContext = createContext();

export default function TimerProvider({ children }) {
  const player = useAtomValue(playerAtom);
  const { controller } = usePlayer();
  const workTimer = useTimer(1500, "work");
  const breakTimer = useTimer(300, "break");
  const longBreakTimer = useTimer(600, "long");
  const [currentTimer, setCurrentTimer] = useState(null);
  const [longBreakCycle, setLongBreakCycle] = useState(4);
  const [longBreakCycleCount, setLongBreakCycleCount] = useState(1);
  const [totalCycle, setTotalCycle] = useState(4);
  const [totalCycleCount, setTotalCycleCount] = useState(1);
  const countdownSoundDelay = 5000;
  const [countdownSound] = useSound(countdownSfx, { volume: 4.0 });
  const [fanfareSound] = useSound(fanfareSfx, { volume: 1.0 });

  let isFinished = false;

  const [isLoaded, setIsLoaded] = useState(false);

  const { switchStatus } = useContext(PlaylistContext);

  // localStorageに書き込み
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`total-cycle`, JSON.stringify(totalCycle));
      localStorage.setItem(`long-break-cycle`, JSON.stringify(longBreakCycle));
    }
  }, [totalCycle, longBreakCycle, isLoaded]);

  // localStorageから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTotalCycle = localStorage.getItem(`total-cycle`);
      const storedLongBreakCycle = localStorage.getItem(`long-break-cycle`);

      if (storedTotalCycle) {
        const parsedTotalCycle = JSON.parse(storedTotalCycle);
        setTotalCycle(parsedTotalCycle);
      }
      if (storedLongBreakCycle) {
        const parsedLongBreakCycle = JSON.parse(storedLongBreakCycle);
        setLongBreakCycle(parsedLongBreakCycle);
      }
      setIsLoaded(true);
    }
  }, []);

  const resetTimer = (timer) => {
    timer.setElapsedTime(0);
    timer.setIsRunning(false);
  };

  const runNextTimer = (timer) => {
    if (!isFinished) {
      timer.setIsRunning(true);
    }
  };

  const wait = async (ms) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  };

  const showCongratulations = () => {
    toast({
      title: "お疲れさまでした！",
      description: "これでまた目標に一歩近づきましたね！",
    });
  };

  const handleBreakEnd = () => {
    if (totalCycleCount >= totalCycle) {
      fanfareSound();
      showCongratulations();
      isFinished = true;
      resetTimer(workTimer);
      resetTimer(breakTimer);
      resetTimer(longBreakTimer);
      setLongBreakCycleCount(1);
      setTotalCycleCount(1);
      setCurrentTimer(workTimer);
      setTimeout(() => {
        controller({ type: "stop" });
      }, 100);
      return;
    }
    setLongBreakCycleCount((prev) => prev + 1);
    setTotalCycleCount((prev) => prev + 1);
  };

  const handleTimerEnd = async (currentTimer, nextTimer) => {
    resetTimer(currentTimer);
    countdownSound();
    await wait(countdownSoundDelay);
    runNextTimer(nextTimer);
    switchStatus();
  };

  // workTimerの終了時処理
  useEffect(() => {
    if (workTimer.remainingTime < 0) {
      const isLongBreak = longBreakCycleCount % longBreakCycle === 0;
      const nextTimer = isLongBreak ? longBreakTimer : breakTimer;
      handleTimerEnd(workTimer, nextTimer);
    }
  }, [workTimer.remainingTime]);

  // breakTimerの終了時処理
  useEffect(() => {
    const timerEnd = async () => {
      if (breakTimer.remainingTime < 0) {
        await handleTimerEnd(breakTimer, workTimer);
        await handleBreakEnd();
      }
    };
    timerEnd();
  }, [breakTimer.remainingTime]);

  // longBreakTimerの終了時処理
  useEffect(() => {
    const timerEnd = async () => {
      if (longBreakTimer.remainingTime < 0) {
        await handleTimerEnd(longBreakTimer, workTimer);
        await handleBreakEnd();
      }
    };
    timerEnd();
  }, [longBreakTimer.remainingTime]);

  // currentTimerの設定処理
  useEffect(() => {
    if (workTimer.isRunning) {
      setCurrentTimer(workTimer);
    } else if (breakTimer.isRunning) {
      setCurrentTimer(breakTimer);
    } else if (longBreakTimer.isRunning) {
      setCurrentTimer(longBreakTimer);
    }
  }, [workTimer.isRunning, breakTimer.isRunning, longBreakTimer.isRunning]);

  const startTimer = () => {
    const timer = currentTimer || workTimer;
    if (!currentTimer) {
      setCurrentTimer(workTimer);
    }

    timer.setIsRunning((prev) => {
      controller({ type: prev ? "pause" : "play" });
      return !prev;
    });
  };

  const clearTimer = () => {
    isFinished = false;
    resetTimer(workTimer);
    resetTimer(breakTimer);
    resetTimer(longBreakTimer);
    setLongBreakCycleCount(1);
    setTotalCycleCount(1);
    setCurrentTimer(workTimer);
    workTimer.setIsRunning(true);
  };

  const skipTimer = () => {
    if (currentTimer) {
      currentTimer.setElapsedTime(currentTimer.totalTime);
    }
  };

  const rewindTimer = () => {
    if (currentTimer) {
      currentTimer.setElapsedTime(0);
    }
  };

  return (
    <>
      <TimerContext.Provider
        value={{
          workTimer,
          breakTimer,
          longBreakTimer,
          longBreakCycle,
          setLongBreakCycle,
          longBreakCycleCount,
          setLongBreakCycleCount,
          totalCycle,
          setTotalCycle,
          totalCycleCount,
          setTotalCycleCount,
          startTimer,
          clearTimer,
          skipTimer,
          rewindTimer,
        }}
      >
        {children}
      </TimerContext.Provider>
    </>
  );
}
