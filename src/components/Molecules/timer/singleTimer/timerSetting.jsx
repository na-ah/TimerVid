import { Slider } from "@mantine/core";
import { useEffect, useState } from "react";

export default function TimerSetting(props) {
  const { setTotalTime, totalTime } = props;
  const [newTime, setNewTime] = useState([
    Math.floor(totalTime / 3600),
    Math.floor((totalTime % 3600) / 60),
    totalTime % 60,
  ]);

  const handleChangeHours = (value) => {
    setNewTime((prevTime) => [value, prevTime[1], prevTime[2]]);
  };

  const handleChangeMinutes = (value) => {
    setNewTime((prevTime) => [prevTime[0], value, prevTime[2]]);
  };

  const handleChangeSeconds = (value) => {
    setNewTime((prevTime) => [prevTime[0], prevTime[1], value]);
  };

  useEffect(() => {
    setTotalTime(newTime[0] * 3600 + newTime[1] * 60 + newTime[2]);
  }, [newTime]);

  return (
    <>
      <div>
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl">hours</h2>
            <Slider
              value={newTime[0]}
              onChange={handleChangeHours}
              step={1}
              size={"sm"}
              max={24}
              marks={[
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 18, label: "18h" },
              ]}
              className="p-5"
            />
          </div>
          <div>
            <h2 className="text-xl">minutes</h2>
            <Slider
              value={newTime[1]}
              onChange={handleChangeMinutes}
              step={1}
              max={59}
              size={"sm"}
              marks={[
                { value: 20, label: "20m" },
                { value: 40, label: "40m" },
              ]}
              className="p-5"
            />
          </div>
          <div>
            <h2 className="text-xl">seconds</h2>
            <Slider
              value={newTime[2]}
              onChange={handleChangeSeconds}
              step={1}
              size={"sm"}
              max={59}
              marks={[
                { value: 20, label: "20s" },
                { value: 40, label: "40s" },
              ]}
              className="p-5"
            />
          </div>
        </section>
      </div>
    </>
  );
}
