import usePlayer from "../../../hooks/usePlayer";
import Player from "../../Molecules/player/player";

export default function PlayerContainer() {
  const { opts, onReady, onEnd } = usePlayer();

  return (
    <>
      <div className="w-full">
        <div className="flex justify-center w-full bg-slate-300">
          <Player
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
          />
        </div>
      </div>
    </>
  );
}
