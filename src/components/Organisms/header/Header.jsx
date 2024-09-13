import { IoIosHelpCircleOutline } from "react-icons/io";
export default function Header({ setIsShowTutorial }) {
  return (
    <>
      <header className="py-5 px-5 border-b-2 h-16 font-bold flex items-center justify-between text-2xl  mx-auto">
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
      </header>
    </>
  );
}
