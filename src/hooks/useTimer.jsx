import { useEffect, useState } from "react";
import { buildStyles } from "react-circular-progressbar";

export default function useTimer(initialTime, mode) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(initialTime);
  const remainingTime = totalTime - elapsedTime;
  const [isRunning, setIsRunning] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorageに書き込み
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`${mode}-timer`, JSON.stringify(totalTime));
    }
  }, [mode, totalTime, isLoaded]);

  // localStorageから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTime = localStorage.getItem(`${mode}-timer`);

      if (storedTime) {
        const parsedTime = JSON.parse(storedTime);
        setTotalTime(parsedTime);
      }
      setIsLoaded(true);
    }
  }, [mode]);

  useEffect(() => {
    setElapsedTime(0);
  }, [totalTime]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prevTime) => {
        if (prevTime > totalTime) {
          setIsRunning(false);
          clearInterval(timer);
          setElapsedTime(0);
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [totalTime, isRunning]);

  const getStyles = (color) => {
    if (isRunning) {
      return buildStyles({
        pathColor: color,
        textColor: color,
        trailColor: "#d6d6d6",
      });
    } else {
      return buildStyles({
        pathColor: "#b9b9b9",
        textColor: "#b9b9b9",
        trailColor: "#eeeeee",
      });
    }
  };

  return {
    totalTime,
    setTotalTime,
    elapsedTime,
    remainingTime,
    showSetting,
    getStyles,
    isRunning,
    setIsRunning,
    setElapsedTime,
    setShowSetting,
  };
}
