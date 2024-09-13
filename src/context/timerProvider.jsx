import { createContext, useContext, useEffect, useState } from "react";
import useTimer from "../hooks/useTimer";
import { PlaylistContext } from "./playlistProvider";
import useSound from "use-sound";
import countdownSfx from "../assets/countdown.mp3";
import { useAtomValue } from "jotai";
import { playerAtom } from "../atoms/atoms";

export const TimerContext = createContext();

export default function TimerProvider({ children }) {
  const player = useAtomValue(playerAtom);
  const workTimer = useTimer(1500, "work");
  const breakTimer = useTimer(300, "break");
  const longBreakTimer = useTimer(600, "long");
  const [currentTimer, setCurrentTimer] = useState(null);
  const [longBreakCycle, setLongBreakCycle] = useState(4);
  const [longBreakCycleCount, setLongBreakCycleCount] = useState(1);
  const [totalCycle, setTotalCycle] = useState(9);
  const [totalCycleCount, setTotalCycleCount] = useState(1);
  const timerSwitchDelay = 5000;
  const [play] = useSound(countdownSfx, { volume: 4.0 });
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

  const handleBreakEnd = () => {
    if (totalCycleCount >= totalCycle) {
      isFinished = true;
      resetTimer(workTimer);
      resetTimer(breakTimer);
      resetTimer(longBreakTimer);
      alert("お疲れ様でした！これでまた一歩目標に近づきましたね！");
      return;
    }
    setLongBreakCycleCount((prev) => prev + 1);
    setTotalCycleCount((prev) => prev + 1);
  };

  const handleTimerEnd = async (currentTimer, nextTimer) => {
    resetTimer(currentTimer);
    play();
    await wait(timerSwitchDelay);
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
    if (breakTimer.remainingTime < 0) {
      handleTimerEnd(breakTimer, workTimer);
      handleBreakEnd();
    }
  }, [breakTimer.remainingTime]);

  // longBreakTimerの終了時処理
  useEffect(() => {
    if (longBreakTimer.remainingTime < 0) {
      handleTimerEnd(longBreakTimer, workTimer);
      handleBreakEnd();
    }
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
    if (!currentTimer) {
      setCurrentTimer(workTimer);
      workTimer.setIsRunning((prev) => !prev);
    } else {
      currentTimer.setIsRunning((prev) => !prev);
    }
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
