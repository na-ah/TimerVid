import { IoIosHelpCircleOutline } from "react-icons/io";
import { TbClock, TbClockOff } from "react-icons/tb";
import { useAtom } from "jotai";
import { isTimerVisibleAtom } from "@/atoms/atoms";

export default function Header({ setIsShowTutorial }) {
  const [isTimerVisible, setIsTimerVisible] = useAtom(isTimerVisibleAtom);

  return (
    <>
      <header className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-6 flex items-center justify-between border-b border-zinc-100/80 sticky top-0 bg-white/80 backdrop-blur-md z-50 transition-all">
        <h1 className="font-silkScreen text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 inline-block text-transparent bg-clip-text select-none cursor-default">
          TimerVid
        </h1>
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            className="text-xs sm:text-sm md:text-base font-medium text-zinc-600 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer transition-all px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-zinc-50"
            onClick={() => setIsTimerVisible((prev) => !prev)}
            title={isTimerVisible ? "タイマーを隠す" : "タイマーを表示する"}
          >
            {isTimerVisible ? <TbClockOff size={20} className="shrink-0" /> : <TbClock size={20} className="shrink-0" />}
            <span className="hidden sm:inline">
              {isTimerVisible ? "Hide Timer" : "Show Timer"}
            </span>
          </button>
          <button
            className="text-xs sm:text-sm md:text-base font-medium text-zinc-600 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer transition-all px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-zinc-50"
            onClick={() => setIsShowTutorial((prev) => !prev)}
          >
            <IoIosHelpCircleOutline size={20} className="shrink-0" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </header>
    </>
  );
}
