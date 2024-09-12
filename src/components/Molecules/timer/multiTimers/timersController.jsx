import TimerControlButton from "../../../Atoms/timer/timerControlButton";

export default function TimersController(props) {
  const { label, onClick } = props;
  return (
    <>
      <div className="w-full">
        <TimerControlButton
          label={label}
          onClick={onClick}
        />
      </div>
    </>
  );
}
