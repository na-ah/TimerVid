import usePlayer from "../../../hooks/usePlayer";
import Player from "../../Molecules/player/player";
import { FaPlay, FaPause, FaForwardStep, FaBackwardStep, FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { useAtomValue } from "jotai";
import { isPlayingAtom } from "../../../atoms/atoms";
import { useContext } from "react";
import { PlaylistContext } from "../../../context/playlistProvider";

export default function PlayerContainer({ isCinemaMode }) {
  const { opts, onReady, onEnd, onError, onStateChange, controller, volume, isMuted } = usePlayer();
  const isPlaying = useAtomValue(isPlayingAtom);
  const { nextVideo, prevVideo } = useContext(PlaylistContext);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeXmark size={isCinemaMode ? 20 : 16} />;
    if (volume < 50) return <FaVolumeLow size={isCinemaMode ? 20 : 16} />;
    return <FaVolumeHigh size={isCinemaMode ? 20 : 16} />;
  };

  return (
    <>
      <div className="w-full flex flex-col rounded-xl overflow-hidden shadow-2xl bg-zinc-900">
        <div className={`relative w-full bg-black aspect-video group ${isCinemaMode ? "max-h-[calc(100vh-250px)]" : ""}`}>
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
              <div className={`bg-white/20 rounded-full backdrop-blur-md border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300 ${isCinemaMode ? "p-6" : "p-3"}`}>
                <FaPlay size={isCinemaMode ? 48 : 24} className="text-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className={`flex flex-col bg-zinc-800/90 backdrop-blur border-t border-white/5 relative z-10 ${isCinemaMode ? "rounded-b-xl pb-1" : "pb-1"}`}>
          
          {/* Row 1: Main Controls (Center) */}
          <div className={`flex items-center justify-center ${isCinemaMode ? "gap-6 py-2" : "gap-4 py-2"}`}>
            <button 
              onClick={prevVideo}
              className={`text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full active:scale-95 ${isCinemaMode ? "p-3" : "p-2"}`}
              aria-label="Previous Video"
            >
              <FaBackwardStep size={isCinemaMode ? 20 : 16} />
            </button>

            <button
              onClick={() => controller({ type: "play/pause" })}
              className={`group relative flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ${isCinemaMode ? "w-12 h-12" : "w-10 h-10"}`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FaPause size={isCinemaMode ? 20 : 16} className="text-white" />
              ) : (
                <FaPlay size={isCinemaMode ? 20 : 16} className="text-white ml-1" />
              )}
            </button>

            <button 
              onClick={nextVideo}
              className={`text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full active:scale-95 ${isCinemaMode ? "p-3" : "p-2"}`}
              aria-label="Next Video"
            >
              <FaForwardStep size={isCinemaMode ? 20 : 16} />
            </button>
          </div>

          {/* Row 2: Volume Controls (Full Width) */}
          <div className={`flex items-center w-full ${isCinemaMode ? "gap-4 px-6 pb-2" : "gap-2 px-3 pb-1"}`}>
            <button
              onClick={() => controller({ type: "toggleMute" })}
              className={`text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10 ${isCinemaMode ? "p-2" : "p-1"}`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            
            <div className="relative flex-1 flex items-center h-full">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                className={`w-full bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 touch-pan-y ${isCinemaMode ? "h-1.5" : "h-1"}`}
                style={{
                  WebkitAppearance: "none", 
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
