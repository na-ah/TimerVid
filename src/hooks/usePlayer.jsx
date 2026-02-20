import { useContext, useEffect, useReducer, useState, useRef } from "react";
import { PlaylistContext } from "../context/playlistProvider";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { playerAtom, resumeTimeAtom, isPlayingAtom } from "../atoms/atoms";

export default function usePlayer() {
  const setPlayer = useSetAtom(playerAtom);
  const player = useAtomValue(playerAtom);
  const [resumeTime] = useAtom(resumeTimeAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const { currentVideoId, nextVideo } = useContext(PlaylistContext);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  // Ref to hold the current intended playing state so we can access it inside onStateChange without causing re-renders
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const reducer = (currentPlayer, action) => {
    switch (action.type) {
      case "setPlayer":
        return action.player;
      case "loadVideoId":
        if (currentPlayer) {
          try {
            currentPlayer.loadVideoById({
              videoId: currentVideoId,
              startSeconds: resumeTime,
            });
          } catch (error) {
            currentPlayer.cueVideoById({
              videoId: currentVideoId,
              startSeconds: resumeTime,
            });
            currentPlayer.playVideo();
          }
        }
        return currentPlayer;
      case "play":
        if (currentPlayer) {
          currentPlayer.playVideo();
        }
        return currentPlayer;
      case "pause":
        if (currentPlayer) {
          currentPlayer.pauseVideo();
        }
        return currentPlayer;
      case "stop":
        if (currentPlayer) {
          currentPlayer.stopVideo();
        }
        return currentPlayer;
      case "getTime":
        if (currentPlayer) {
          currentPlayer.getCurrentTime();
        }
        return currentPlayer;
      case "play/pause":
        if (currentPlayer) {
          if (currentPlayer.getPlayerState() === 1) {
            currentPlayer.pauseVideo();
          } else {
            currentPlayer.playVideo();
          }
        }
        return currentPlayer;
      default:
        return currentPlayer;
    }
  };

  useEffect(() => {
    rawController({ type: "loadVideoId" });
  }, [currentVideoId]);

  const [, rawController] = useReducer(reducer, null);

  const controller = (action) => {
    if (action.type === 'play') setIsPlaying(true);
    if (action.type === 'pause' || action.type === 'stop') setIsPlaying(false);
    if (action.type === 'play/pause') {
      setIsPlaying(player?.getPlayerState() !== 1);
    }
    rawController(action);
  };

  useEffect(() => {
    if (player) {
      rawController({ type: "setPlayer", player });
    }
  }, [player]);

  const onReady = (e) => {
    setPlayer(e.target);
    rawController({ type: "setPlayer", player: e.target });
    setIsPlayerReady(true);
    setRetryCount(0);
    try {
      e.target.loadVideoById({
        videoId: currentVideoId,
      });
    } catch (error) {
      console.warn("Failed to load video, trying cue method:", error);
      e.target.cueVideoById({
        videoId: currentVideoId,
      });
      e.target.playVideo();
    }
  };

  const onEnd = () => {
    setRetryCount(0);
    nextVideo();
    setTimeout(() => {
      controller({ type: "play" });
    }, 100);
  };

  const onError = (error) => {
    console.warn("YouTube player error:", error.data);
    
    // YouTube API Error Codes for unplayable videos:
    // 100: Video not found (removed or private)
    // 101, 150: Embedding disabled by video owner
    if (error.data === 100 || error.data === 101 || error.data === 150) {
      console.warn("Video unavailable. Skipping to next video immediately.");
      setRetryCount(0);
      nextVideo();
      setTimeout(() => {
        controller({ type: "play" });
      }, 100);
      return;
    }

    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        if (player && currentVideoId) {
          try {
            player.loadVideoById({
              videoId: currentVideoId,
              startSeconds: resumeTime,
            });
          } catch (retryError) {
            console.warn("Retry failed, skipping to next video:", retryError);
            nextVideo();
            setTimeout(() => {
              controller({ type: "play" });
            }, 100);
          }
        }
      }, 1000 * retryCount);
    } else {
      console.warn("Max retries reached, skipping to next video");
      setRetryCount(0);
      nextVideo();
      setTimeout(() => {
        controller({ type: "play" });
      }, 100);
    }
  };

  const onStateChange = (event) => {
    const state = event.data;
    if (state === -1 && retryCount === 0) {
      setTimeout(() => {
        if (player && player.getPlayerState() === -1) {
          console.warn("Video failed to start, attempting retry");
          onError({ data: "UNSTARTED_TIMEOUT" });
        }
      }, 5000);
    }
    
    // YouTube automatically pauses live streams after 2-3 hours (state === 2).
    // If the app expects it to be playing, automatically resume it.
    if (state === 2 && isPlayingRef.current) {
      console.warn("Video paused unexpectedly. Resuming...");
      setTimeout(() => {
        if (player) player.playVideo();
      }, 1000);
    }
    
    // If user manually clicked play on the iframe, update our intended state
    if (state === 1 && !isPlayingRef.current) {
      setIsPlaying(true);
    }
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      rel: 0,
    },
  };

  return {
    controller,
    onReady,
    opts,
    onEnd,
    onError,
    onStateChange,
    isPlayerReady,
  };
}
