export default function TimersInformation(props) {
  const { totalCycle, totalCycleCount, longBreakCycle, longBreakCycleCount } =
    props;

  return (
    <>
      <p>
        <span>{`lap: ${totalCycleCount}  -  `}</span>
        {totalCycleCount}/{totalCycle}
      </p>
    </>
  );
}
