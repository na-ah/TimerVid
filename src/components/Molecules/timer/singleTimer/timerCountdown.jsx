import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";

export default function Countdown(props) {
  const {
    remainingTime,
    totalTime,
    getStyles,
    convertSecondsToFormattedTime,
    color,
  } = props;
  return (
    <>
      <CircularProgressbar
        value={remainingTime}
        maxValue={totalTime}
        text={convertSecondsToFormattedTime(remainingTime)}
        styles={getStyles(color)}
      />
    </>
  );
}
