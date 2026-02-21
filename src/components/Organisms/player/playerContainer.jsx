import usePlayer from "../../../hooks/usePlayer";
import Player from "../../Molecules/player/player";
import { FaPlay, FaPause, FaForwardStep, FaBackwardStep, FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { useAtomValue } from "jotai";
import { isPlayingAtom } from "../../../atoms/atoms";
import { useContext } from "react";
import { PlaylistContext } from "../../../context/playlistProvider";

export default function PlayerContainer() {
  const { opts, onReady, onEnd, onError, onStateChange, controller, volume, isMuted } = usePlayer();
  const isPlaying = useAtomValue(isPlayingAtom);
  const { nextVideo, prevVideo } = useContext(PlaylistContext);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeXmark size={20} />;
    if (volume < 50) return <FaVolumeLow size={20} />;
    return <FaVolumeHigh size={20} />;
  };

  return (
    <>
      <div className="w-full flex flex-col rounded-xl overflow-hidden shadow-2xl bg-zinc-900">
        <div className="relative w-full bg-black aspect-video group">
          <div className="flex justify-center w-full h-full">
            <Player
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
              onError={onError}
              onStateChange={onStateChange}
            />
          </div>
          
          {/* Overlay Play Button (Visible when paused and hovered) */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer backdrop-blur-sm transition-opacity opacity-100 hover:bg-black/40"
              onClick={() => controller({ type: "play" })}
            >
              <div className="bg-white/20 p-6 rounded-full backdrop-blur-md border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300">
                <FaPlay size={48} className="text-white ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-800/90 backdrop-blur border-t border-white/5 relative z-10">
          
          {/* Empty div for centering alignment */}
          <div className="w-1/4 hidden md:block"></div>

          {/* Main Controls (Center) */}
          <div className="flex items-center justify-center gap-6 md:gap-8 flex-1">
            <button 
              onClick={prevVideo}
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Previous Video"
            >
              <FaBackwardStep size={24} />
            </button>

            <button
              onClick={() => controller({ type: "play/pause" })}
              className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FaPause size={28} className="text-white" />
              ) : (
                <FaPlay size={28} className="text-white ml-1" />
              )}
            </button>

            <button 
              onClick={nextVideo}
              className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Next Video"
            >
              <FaForwardStep size={24} />
            </button>
          </div>

          {/* Volume Controls (Right) */}
          <div className="w-1/4 flex items-center justify-end group/volume gap-2">
            <button
              onClick={() => controller({ type: "toggleMute" })}
              className="text-zinc-400 hover:text-white transition-colors p-2"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out flex items-center">
               <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
