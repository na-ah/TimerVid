import Countdown from "../../../Molecules/timer/singleTimer/timerCountdown";
import TimerSetting from "../../../Molecules/timer/singleTimer/timerSetting";
import TimerTitle from "../../../Molecules/timer/singleTimer/timerTitle";
import useDisplayTime from "../../../../hooks/useDisplayTime";
import { NumberInput } from "@mantine/core";

export default function TimerContainer(props) {
  const {
    timer,
    label,
    color,
    totalCycle,
    setTotalCycle,
    longBreakCycle,
    setLongBreakCycle,
    workTimerTotalTime,
    breakTimerTotalTime,
    breakCount,
    longBreakTimerTotalTime,
    totalRequiredTime,
    longBreakCount,
  } = props;
  const { convertSecondsToFormattedTime } = useDisplayTime();

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-white border w-fit flex flex-col items-center p-3">
          <div className="flex flex-col items-center">
            <div className="flex p-2 items-center">
              <div
                className="flex items-center cursor-pointer w-full"
                onClick={() => timer.setShowSetting((prev) => !prev)}
              >
                <Countdown
                  convertSecondsToFormattedTime={convertSecondsToFormattedTime}
                  remainingTime={timer.remainingTime}
                  totalTime={timer.totalTime}
                  getStyles={timer.getStyles}
                  color={color}
                />
              </div>
            </div>
            <h2>
              <TimerTitle timerLabel={label} />
              <span></span>
            </h2>
          </div>
        </div>
        {timer.showSetting && (
          <div className="p-5 w-full">
            <TimerSetting
              showSetting={timer.showSetting}
              setTotalTime={timer.setTotalTime}
              totalTime={timer.totalTime}
            />
            <div className="">
              <hr className="mt-8 mb-4" />
              {label === "work" && (
                <>
                  <div>
                    <div>
                      work count:
                      <NumberInput
                        value={totalCycle}
                        onChange={setTotalCycle}
                        min={1}
                        suffix=" times"
                      />
                    </div>
                  </div>
                </>
              )}
              {label === "break" && (
                <>
                  <div>
                    <div>
                      <h2 className="text-lg font-bold">total count</h2>
                      <p>work: {totalCycle} times</p>
                      <p>break: {breakCount} times</p>
                      <p>long: {longBreakCount} times</p>
                    </div>
                    <hr className="mb-2 mt-4" />
                    <div>
                      <h2 className="text-lg font-bold">total time</h2>
                      <p>
                        work: {Math.floor(workTimerTotalTime / 3600)}h
                        {(workTimerTotalTime / 60) % 60}m
                      </p>
                      <p>
                        break: {Math.floor(breakTimerTotalTime / 3600)}h
                        {(breakTimerTotalTime / 60) % 60}m
                      </p>
                      <p>
                        long: {Math.floor(longBreakTimerTotalTime / 3600)}h
                        {(longBreakTimerTotalTime / 60) % 60}m
                      </p>
                    </div>
                    <hr className="mb-2 mt-4" />
                    <div>
                      <h2 className="text-lg font-bold">summary</h2>
                      <p>
                        total: {Math.floor(totalRequiredTime / 3600)}h
                        {(totalRequiredTime / 60) % 60}m
                      </p>
                      <p>
                        work: {Math.floor(workTimerTotalTime / 3600)}h
                        {(workTimerTotalTime / 60) % 60}m
                      </p>
                      <p>
                        break:{" "}
                        {Math.floor(
                          (totalRequiredTime - workTimerTotalTime) / 3600
                        )}
                        h{((totalRequiredTime - workTimerTotalTime) / 60) % 60}m
                      </p>
                      <p>
                        work%:{" "}
                        {Math.round(
                          (workTimerTotalTime / totalRequiredTime) * 1000
                        ) / 10}
                        %
                      </p>
                    </div>
                  </div>
                </>
              )}
              {label === "long" && (
                <>
                  <div>
                    <div>
                      long break per:
                      <NumberInput
                        value={longBreakCycle}
                        onChange={setLongBreakCycle}
                        min={1}
                        suffix=" work"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
