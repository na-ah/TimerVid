import { IoIosHelpCircleOutline } from "react-icons/io";
export default function Header({ setIsShowTutorial }) {
  return (
    <>
      <header className="border-b-2 h-16 font-bold flex items-center text-2xl">
        <div className="flex items-center justify-between w-[480px] md:w-[768px] xl:w-[1280px]  mx-auto px-5">
          <h1 className="font-silkScreen text-4xl font-medium bg-gradient-to-r from-indigo-500 to-emerald-500 inline-block text-transparent bg-clip-text">
            TimerVid
          </h1>
          <div
            className="text-lg flex  items-center gap-1 cursor-pointer"
            onClick={() => setIsShowTutorial((prev) => !prev)}
          >
            <IoIosHelpCircleOutline />
            Help
          </div>
        </div>
      </header>
    </>
  );
}
