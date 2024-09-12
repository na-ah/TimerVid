export default function Header() {
  return (
    <>
      <header className="border-b-2 h-16 font-bold flex items-center text-2xl">
        <div className="w-[480px] md:w-[768px] xl:w-[1280px]  mx-auto px-5">
          <h1 className="font-silkScreen text-3xl font-medium bg-gradient-to-r from-indigo-500 to-green-500 inline-block text-transparent bg-clip-text">
            TimerVid
          </h1>
        </div>
      </header>
    </>
  );
}
