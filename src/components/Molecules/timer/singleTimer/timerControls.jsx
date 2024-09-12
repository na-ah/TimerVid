import TimerControlButton from "../../../Atoms/timer/timerControlButton";

export default function TimerControls(props) {
  const { setIsRunning, setElapsedTime, setTotalTime } = props;
  return (
    <>
      <TimerControlButton
        onClick={() => setIsRunning((prev) => !prev)}
        label="start/stop"
      />
      <TimerControlButton
        onClick={() => {
          setElapsedTime(0);
          setIsRunning(false);
        }}
        label={"reset"}
      />
      <TimerControlButton
        onClick={() => setTotalTime((prevTime) => prevTime + 1)}
        label={"+"}
      />
      <TimerControlButton
        onClick={() => setTotalTime((prevTime) => prevTime - 1)}
        label={"-"}
      />
    </>
  );
}
