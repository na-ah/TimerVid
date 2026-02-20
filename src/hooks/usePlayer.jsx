import { useContext, useEffect, useReducer, useState } from "react";
import { PlaylistContext } from "../context/playlistProvider";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { playerAtom, resumeTimeAtom } from "../atoms/atoms";

export default function usePlayer() {
  const setPlayer = useSetAtom(playerAtom);
  const player = useAtomValue(playerAtom);
  const [resumeTime] = useAtom(resumeTimeAtom);
  const { currentVideoId, nextVideo } = useContext(PlaylistContext);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
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
    controller({ type: "loadVideoId" });
  }, [currentVideoId]);

  const [, controller] = useReducer(reducer, null);

  useEffect(() => {
    if (player) {
      controller({ type: "setPlayer", player });
    }
  }, [player, controller]);

  const onReady = (e) => {
    setPlayer(e.target);
    controller({ type: "setPlayer", player: e.target });
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
          }
        }
      }, 1000 * retryCount);
    } else {
      console.warn("Max retries reached, skipping to next video");
      setRetryCount(0);
      nextVideo();
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
