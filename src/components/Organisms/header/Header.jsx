import { IoIosHelpCircleOutline } from "react-icons/io";
import { TbClock, TbClockOff } from "react-icons/tb";
import { useAtom } from "jotai";
import { isTimerVisibleAtom } from "@/atoms/atoms";

export default function Header({ setIsShowTutorial }) {
  const [isTimerVisible, setIsTimerVisible] = useAtom(isTimerVisibleAtom);

  return (
    <>
      <header className="py-5 px-5 border-b-2 h-16 font-bold flex items-center justify-between text-2xl  mx-auto">
        <h1 className="font-silkScreen text-4xl font-medium bg-gradient-to-r from-indigo-500 to-emerald-500 inline-block text-transparent bg-clip-text">
          TimerVid
        </h1>
        <div className="flex items-center gap-4">
          <div
            className="text-lg flex items-center gap-1 cursor-pointer"
            onClick={() => setIsTimerVisible((prev) => !prev)}
            title={isTimerVisible ? "タイマーを隠す" : "タイマーを表示する"}
          >
            {isTimerVisible ? <TbClockOff /> : <TbClock />}
            <span className="hidden sm:inline">
              {isTimerVisible ? "Hide Timer" : "Show Timer"}
            </span>
          </div>
          <div
            className="text-lg flex items-center gap-1 cursor-pointer"
            onClick={() => setIsShowTutorial((prev) => !prev)}
          >
            <IoIosHelpCircleOutline />
            <span className="hidden sm:inline">Help</span>
          </div>
        </div>
      </header>
    </>
  );
}
