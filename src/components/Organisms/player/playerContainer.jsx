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
  const { nextVideo, prevVideo, isWorking, workPlaylist, breakPlaylist } = useContext(PlaylistContext);

  const currentTitle = isWorking ? workPlaylist.currentVideoTitle : breakPlaylist.currentVideoTitle;

  const getVolumeIcon = (size = 16) => {
    if (isMuted || volume === 0) return <FaVolumeXmark size={size} />;
    if (volume < 50) return <FaVolumeLow size={size} />;
    return <FaVolumeHigh size={size} />;
  };

  // Cinema Mode Layout (Existing)
  if (isCinemaMode) {
    return (
      <div className="w-full flex flex-col rounded-xl overflow-hidden shadow-2xl bg-zinc-900">
        <div className={`relative w-full bg-black aspect-video group max-h-[calc(100vh-250px)]`}>
          <div className="flex justify-center w-full h-full">
            <Player
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
              onError={onError}
              onStateChange={onStateChange}
            />
          </div>
          
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer backdrop-blur-sm transition-opacity opacity-100 hover:bg-black/40"
              onClick={() => controller({ type: "play" })}
            >
              <div className="bg-white/20 rounded-full backdrop-blur-md border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300 p-6">
                <FaPlay size={48} className="text-white ml-1" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-zinc-800/90 backdrop-blur border-t border-white/5 relative z-10 rounded-b-xl pb-1">
          <div className="flex items-center justify-center gap-6 py-2">
            <button 
              onClick={prevVideo}
              className="text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full active:scale-95 p-3"
              aria-label="Previous Video"
            >
              <FaBackwardStep size={20} />
            </button>

            <button
              onClick={() => controller({ type: "play/pause" })}
              className="group relative flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 w-12 h-12"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FaPause size={20} className="text-white" />
              ) : (
                <FaPlay size={20} className="text-white ml-1" />
              )}
            </button>

            <button 
              onClick={nextVideo}
              className="text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full active:scale-95 p-3"
              aria-label="Next Video"
            >
              <FaForwardStep size={20} />
            </button>
          </div>

          <div className="flex items-center w-full gap-4 px-6 pb-2">
            <button
              onClick={() => controller({ type: "toggleMute" })}
              className="text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10 p-2"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon(20)}
            </button>
            
            <div className="relative flex-1 flex items-center h-full">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                className="w-full bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 touch-pan-y h-1.5"
                style={{ WebkitAppearance: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Mode Layout (New: Media Object Style)
  return (
    <div className="flex w-full h-[120px] bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-zinc-800">
      {/* Video Section */}
      <div className="relative h-full aspect-video bg-black shrink-0">
        <div className="w-full h-full">
          <Player
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
            onError={onError}
            onStateChange={onStateChange}
          />
        </div>
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
            onClick={() => controller({ type: "play" })}
          >
            <div className="bg-white/20 rounded-full backdrop-blur-sm border border-white/30 p-2 shadow-lg">
              <FaPlay size={16} className="text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info & Controls Section */}
      <div className="flex flex-col flex-1 p-3 justify-between min-w-0 bg-zinc-800/50">
        {/* Title */}
        <div className="w-full">
          <h3 className="text-sm font-medium text-zinc-200 line-clamp-2 leading-tight" title={currentTitle}>
            {currentTitle || "動画が選択されていません"}
          </h3>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 mt-1">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={prevVideo}
              className="text-zinc-400 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaBackwardStep size={14} />
            </button>
            <button
              onClick={() => controller({ type: "play/pause" })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 shadow-md hover:scale-105 transition-all"
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </button>
            <button 
              onClick={nextVideo}
              className="text-zinc-400 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaForwardStep size={14} />
            </button>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-[100px] justify-end">
            <button
              onClick={() => controller({ type: "toggleMute" })}
              className="text-zinc-400 hover:text-white p-1"
            >
              {getVolumeIcon(14)}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
              className="w-full bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 h-1"
              style={{ WebkitAppearance: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
