import usePlayer from "../../../hooks/usePlayer";
import Player from "../../Molecules/player/player";
import { FaPlay, FaPause, FaForwardStep, FaBackwardStep, FaVolumeHigh, FaVolumeLow, FaVolumeXmark, FaExpand, FaCompress, FaRepeat } from "react-icons/fa6";
import { useAtomValue, useAtom } from "jotai";
import { isPlayingAtom, playerAtom, isRepeatOneAtom } from "../../../atoms/atoms";
import { useContext, useState, useEffect } from "react";
import { PlaylistContext } from "../../../context/playlistProvider";

export default function PlayerContainer({ isCinemaMode, setIsCinemaMode, isAmbientMode, setIsAmbientMode }) {
  const { opts, onReady, onEnd, onError, onStateChange, controller, volume, isMuted } = usePlayer();
  const isPlaying = useAtomValue(isPlayingAtom);
  const player = useAtomValue(playerAtom);
  const [isRepeatOne, setIsRepeatOne] = useAtom(isRepeatOneAtom);
  const { nextVideo, prevVideo, isWorking, workPlaylist, breakPlaylist } = useContext(PlaylistContext);

  const currentTitle = isWorking ? workPlaylist.currentVideoTitle : breakPlaylist.currentVideoTitle;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // シークバー用の時間更新
  useEffect(() => {
    let interval;
    if (isPlaying && player && player.getCurrentTime) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration() || 0);
      }, 1000);
    } else if (player && player.getCurrentTime) {
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration() || 0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (player && player.seekTo) {
      player.seekTo(newTime, true);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getVolumeIcon = (size = 16) => {
    if (isMuted || volume === 0) return <FaVolumeXmark size={size} />;
    if (volume < 50) return <FaVolumeLow size={size} />;
    return <FaVolumeHigh size={size} />;
  };

  if (isAmbientMode) {
     return (
        <div className="w-full h-full relative group bg-black overflow-hidden flex flex-col justify-end">
          {/* Full Screen Video */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center relative [&>div]:w-full [&>div]:h-full [&>div>iframe]:w-full [&>div>iframe]:h-full pointer-events-auto">
            <Player
              opts={{...opts, playerVars: { ...opts.playerVars, controls: 0 }}}
              onReady={onReady}
              onEnd={onEnd}
              onError={onError}
              onStateChange={onStateChange}
              className="w-full h-full object-cover scale-[1.05]"
            />
          </div>

          {!isPlaying && (
            <div 
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-500 z-20 bg-black/40 backdrop-blur-sm opacity-100 hover:bg-black/30`}
              onClick={() => controller({ type: "play" })}
            >
              <div className={`rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 bg-white/10 border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:scale-110 hover:bg-white/20 p-8`}>
                <FaPlay size={48} className={`text-white ml-1 drop-shadow-lg`} />
              </div>
            </div>
          )}

          {/* Floating Controls at bottom */}
          <div className="relative z-30 mb-8 mx-auto w-[90%] max-w-4xl bg-[#16191e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-6">
             {/* Title and Exit Button */}
             <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1 block">Now Playing</span>
                  <h2 className="text-2xl font-bold text-white/95 truncate drop-shadow-lg leading-tight">
                    {currentTitle || "No Video"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                     if (setIsAmbientMode) setIsAmbientMode(false);
                  }}
                  className="shrink-0 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg bg-white/5 px-4 py-2 text-sm font-medium flex items-center gap-2"
                >
                  <FaCompress size={14} /> アンビエントモードを終了
                </button>
             </div>
             
             {/* Seek bar */}
             <div className="flex items-center gap-4 w-full">
               <span className="text-xs font-medium text-zinc-300 w-10 text-right">{formatTime(currentTime)}</span>
               <input
                 type="range"
                 min="0"
                 max={duration || 100}
                 value={currentTime}
                 onChange={handleSeek}
                 className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300 bg-white/10 transition-all"
                 style={{ 
                   WebkitAppearance: "none",
                   background: duration ? `linear-gradient(to right, #818cf8 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%)` : 'rgba(255,255,255,0.1)'
                 }}
               />
               <span className="text-xs font-medium text-zinc-300 w-10 text-left">{formatTime(duration)}</span>
             </div>

             {/* Playback Controls */}
             <div className="flex items-center justify-between gap-6">
                <div className="flex-1 flex items-center justify-start gap-4">
                  <button
                    onClick={() => controller({ type: "toggleMute" })}
                    className="text-zinc-300 hover:text-white transition-all rounded-full hover:bg-white/10 p-2"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {getVolumeIcon(22)}
                  </button>
                  
                  <div className="relative w-24 lg:w-32 flex items-center h-full group/volume">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300 opacity-70 group-hover/volume:opacity-100 transition-all"
                      style={{ 
                        WebkitAppearance: "none",
                        background: `linear-gradient(to right, #818cf8 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%)`
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-8 flex-1 justify-center">
                  <button 
                    onClick={prevVideo}
                    className="text-zinc-300 hover:text-white transition-all hover:bg-white/10 rounded-full p-4 group"
                  >
                    <FaBackwardStep size={24} className="group-active:scale-90 transition-transform" />
                  </button>

                  <button
                    onClick={() => controller({ type: "play/pause" })}
                    className="group relative flex items-center justify-center bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 w-16 h-16"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isPlaying ? (
                      <FaPause size={28} className="text-white" />
                    ) : (
                      <FaPlay size={28} className="text-white ml-1.5" />
                    )}
                  </button>

                  <button 
                    onClick={nextVideo}
                    className="text-zinc-300 hover:text-white transition-all hover:bg-white/10 rounded-full p-4 group"
                  >
                    <FaForwardStep size={24} className="group-active:scale-90 transition-transform" />
                  </button>

                  <button 
                    onClick={() => setIsRepeatOne(!isRepeatOne)}
                    className={`${isRepeatOne ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] bg-white/5" : "text-zinc-300 hover:text-white hover:bg-white/10"} transition-all rounded-full p-4 group`}
                    aria-label={isRepeatOne ? "Disable Repeat One" : "Enable Repeat One"}
                  >
                    <FaRepeat size={20} className="group-active:scale-90 transition-transform" />
                  </button>
                </div>
                
                <div className="flex-1 flex justify-end">
                </div>
             </div>
          </div>
        </div>
     );
  }

  return (
    <div className={`flex w-full overflow-hidden transition-all duration-500 ${isCinemaMode ? "flex-col rounded-2xl shadow-2xl bg-[#0f1115] border border-white/5 h-full" : "h-[120px] bg-zinc-900 rounded-xl shadow-md border border-zinc-800"}`}>
      
      {/* Video Section */}
      <div className={`relative bg-black group shrink-0 ${isCinemaMode ? "w-full flex-1 flex flex-col items-center justify-center overflow-hidden min-h-[200px]" : "h-full aspect-video"}`}>
        <div className={`w-full h-full ${isCinemaMode ? "absolute inset-0 flex items-center justify-center transform transition-transform duration-700 group-hover:scale-[1.01]" : ""}`}>
          
          <div className={`w-full h-full ${isCinemaMode ? "flex items-center justify-center relative [&>div]:w-full [&>div]:h-full [&>div>iframe]:w-full [&>div>iframe]:h-full" : ""}`}>
            <Player
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
              onError={onError}
              onStateChange={onStateChange}
              className={`w-full h-full ${isCinemaMode ? "pointer-events-auto" : ""}`}
            />
          </div>

          {!isPlaying && (
            <div 
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-500 z-20 ${isCinemaMode ? "bg-black/40 backdrop-blur-sm opacity-100 hover:bg-black/30" : "bg-black/30 hover:bg-black/40"}`}
              onClick={() => controller({ type: "play" })}
            >
              <div className={`rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-300 ${isCinemaMode ? "bg-white/10 backdrop-blur-xl border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:scale-110 hover:bg-white/20 p-8" : "bg-white/20 border-white/30 p-2 shadow-lg"}`}>
                <FaPlay size={isCinemaMode ? 48 : 16} className={`text-white ${isCinemaMode ? "ml-1 drop-shadow-lg" : "ml-0.5"}`} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Info & Controls Section */}
      {isCinemaMode ? (
        <div className="flex-none flex flex-col bg-[#16191e]/90 backdrop-blur-xl border-t border-white/10 relative z-10 px-6 py-4">
          
          {/* Seek bar row */}
          <div className="flex items-center gap-4 mb-4 w-full">
            <span className="text-xs font-medium text-zinc-400 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 bg-zinc-700 transition-all"
              style={{ 
                WebkitAppearance: "none",
                background: duration ? `linear-gradient(to right, #6366f1 ${(currentTime / duration) * 100}%, #3f3f46 ${(currentTime / duration) * 100}%)` : '#3f3f46'
              }}
            />
            <span className="text-xs font-medium text-zinc-400 w-10 text-left">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 flex items-center justify-start gap-3">
              <button
                onClick={() => controller({ type: "toggleMute" })}
                className="text-zinc-400 hover:text-white transition-all rounded-full hover:bg-white/5 p-2"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {getVolumeIcon(20)}
              </button>
              
              <div className="relative w-24 lg:w-32 flex items-center h-full group/volume">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => controller({ type: "setVolume", payload: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 opacity-70 group-hover/volume:opacity-100 transition-all"
                  style={{ 
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, #6366f1 ${isMuted ? 0 : volume}%, #3f3f46 ${isMuted ? 0 : volume}%)`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 flex-1 justify-center">
              <button 
                onClick={prevVideo}
                className="text-zinc-400 hover:text-white transition-all hover:bg-white/10 rounded-full p-3 group"
                aria-label="Previous Video"
              >
                <FaBackwardStep size={20} className="group-active:scale-90 transition-transform" />
              </button>

              <button
                onClick={() => controller({ type: "play/pause" })}
                className="group relative flex items-center justify-center bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 w-14 h-14"
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
                className="text-zinc-400 hover:text-white transition-all hover:bg-white/10 rounded-full p-3 group"
                aria-label="Next Video"
              >
                <FaForwardStep size={20} className="group-active:scale-90 transition-transform" />
              </button>

              <button 
                onClick={() => setIsRepeatOne(!isRepeatOne)}
                className={`${isRepeatOne ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] bg-white/5" : "text-zinc-400 hover:text-white hover:bg-white/10"} transition-all rounded-full p-3 group`}
                aria-label={isRepeatOne ? "Disable Repeat One" : "Enable Repeat One"}
              >
                <FaRepeat size={18} className="group-active:scale-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 flex justify-end">
                {/* プレースホルダー（右側のバランスをとるため） */}
            </div>
          </div>
        </div>
      ) : (
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
          <div className="w-full pr-24"> {/* Avoid overlap with toggle button */}
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
              
              <button 
                onClick={() => setIsRepeatOne(!isRepeatOne)}
                className={`${isRepeatOne ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] bg-white/5" : "text-zinc-400 hover:text-white hover:bg-white/10"} p-1.5 rounded-full transition-colors`}
                aria-label={isRepeatOne ? "Disable Repeat One" : "Enable Repeat One"}
              >
                <FaRepeat size={14} />
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
      )}
    </div>
  );
}
