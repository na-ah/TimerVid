import { Slider } from "@mantine/core";

export default function TimersSetting(props) {
  const { longBreakCycle, setLongBreakCycle, totalCycle, setTotalCycle } =
    props;

  return (
    <>
      <h2 className="text-xl">Cycle Setting</h2>
      <p>longBreakCycle: {longBreakCycle}</p>
      <div className="w-full">
        <Slider
          color="blue"
          min={0}
          max={30}
          value={longBreakCycle}
          onChange={(value) => setLongBreakCycle(value)}
        />
      </div>
      <p>totalCycle: {totalCycle}</p>
      <div className="w-full">
        <Slider
          color="blue"
          min={0}
          max={30}
          value={totalCycle}
          onChange={(value) => setTotalCycle(value)}
        />
      </div>
    </>
  );
}
