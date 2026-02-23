import usePlayer from "../../../hooks/usePlayer";
import Player from "../../Molecules/player/player";
import { FaPlay, FaPause, FaForwardStep, FaBackwardStep, FaVolumeHigh, FaVolumeLow, FaVolumeXmark, FaExpand } from "react-icons/fa6";
import { useAtomValue } from "jotai";
import { isPlayingAtom } from "../../../atoms/atoms";
import { useContext } from "react";
import { PlaylistContext } from "../../../context/playlistProvider";

export default function PlayerContainer({ isCinemaMode, setIsCinemaMode }) {
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
      <div className="w-full flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0f1115] border border-white/5 h-full">
        <div className={`relative w-full bg-black aspect-video group max-h-[calc(100vh-280px)] overflow-hidden`}>
          <div className="flex justify-center w-full h-full transform transition-transform duration-700 group-hover:scale-[1.01]">
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
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-sm transition-all duration-500 opacity-100 hover:bg-black/30"
              onClick={() => controller({ type: "play" })}
            >
              <div className="bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:scale-110 hover:bg-white/20 transition-all duration-300 p-8">
                <FaPlay size={48} className="text-white ml-1 drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* Title Overlay in Player (Top Left) */}
          {isPlaying && (
            <div className="absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <h2 className="text-xl font-medium text-white/90 truncate drop-shadow-md">
                {currentTitle}
              </h2>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-[#16191e]/80 backdrop-blur-xl border-t border-white/5 relative z-10 p-4">
          <div className="flex items-center justify-between gap-6 mb-2">
            <div className="flex-1 hidden md:block">
               <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-1">Now Playing</span>
               <h3 className="text-sm font-semibold text-zinc-200 truncate max-w-xs">{currentTitle}</h3>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center">
              <button 
                onClick={prevVideo}
                className="text-zinc-400 hover:text-white transition-all hover:bg-white/5 rounded-full p-3 group"
                aria-label="Previous Video"
              >
                <FaBackwardStep size={18} className="group-active:scale-90 transition-transform" />
              </button>

              <button
                onClick={() => controller({ type: "play/pause" })}
                className="group relative flex items-center justify-center bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 w-14 h-14"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {isPlaying ? (
                  <FaPause size={22} className="text-white" />
                ) : (
                  <FaPlay size={22} className="text-white ml-1" />
                )}
              </button>

              <button 
                onClick={nextVideo}
                className="text-zinc-400 hover:text-white transition-all hover:bg-white/5 rounded-full p-3 group"
                aria-label="Next Video"
              >
                <FaForwardStep size={18} className="group-active:scale-90 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              <button
                onClick={() => controller({ type: "toggleMute" })}
                className="text-zinc-400 hover:text-white transition-all rounded-full hover:bg-white/5 p-2"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {getVolumeIcon(18)}
              </button>
              
              <div className="relative w-24 lg:w-32 flex items-center h-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  style={{ 
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, #6366f1 ${isMuted ? 0 : volume}%, #3f3f46 ${isMuted ? 0 : volume}%)`
                  }}
                />
              </div>
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
      <div className="flex flex-col flex-1 p-3 justify-between min-w-0 bg-zinc-800/50 relative">
        {/* Cinema Mode Toggle (Top Right) */}
        <button
          onClick={() => setIsCinemaMode(true)}
          className="absolute top-2 right-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors z-10"
          title="シアターモードへ切り替え"
        >
          <span>シアター</span>
          <FaExpand size={14} />
        </button>

        {/* Title */}
        <div className="w-full pr-16"> {/* Avoid overlap with toggle button */}
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
              className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              style={{ 
                WebkitAppearance: "none",
                background: `linear-gradient(to right, #6366f1 ${isMuted ? 0 : volume}%, #52525b ${isMuted ? 0 : volume}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
