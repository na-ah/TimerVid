export default function TimerInfo(props) {
  const { totalTime, elapsedTime, remainingTime } = props;
  return (
    <>
      <div>
        <p>totalTime: {totalTime}</p>
        <p>elapsedTime: {elapsedTime}</p>
        <p>remainingTime: {remainingTime}</p>
      </div>
    </>
  );
}
