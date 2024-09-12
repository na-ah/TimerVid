export default function useDisplayTime() {
  const convertSecondsToTime = (targetSeconds) => {
    const hours = Math.floor(targetSeconds / 3600);
    const minutes = Math.floor((targetSeconds % 3600) / 60);
    const seconds = targetSeconds % 60;

    return { hours, minutes, seconds };
  };

  const convertNumToPadString = (target) => {
    return String(target).padStart(2, "0");
  };

  const formatTime = (targetTime) => {
    const { hours, minutes, seconds } = targetTime;
    return `${convertNumToPadString(hours)}:${convertNumToPadString(
      minutes
    )}:${convertNumToPadString(seconds)}`;
  };

  const convertSecondsToFormattedTime = (targetSeconds) => {
    return formatTime(convertSecondsToTime(targetSeconds));
  };

  return {
    convertSecondsToFormattedTime,
  };
}
