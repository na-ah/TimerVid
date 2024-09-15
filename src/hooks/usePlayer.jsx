import { useContext, useEffect, useReducer } from "react";
import { PlaylistContext } from "../context/playlistProvider";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { playerAtom, resumeTimeAtom } from "../atoms/atoms";

export default function usePlayer() {
  const setPlayer = useSetAtom(playerAtom);
  const player = useAtomValue(playerAtom);
  const [resumeTime] = useAtom(resumeTimeAtom);
  const { currentVideoId, nextVideo } = useContext(PlaylistContext);
  const reducer = (currentPlayer, action) => {
    switch (action.type) {
      case "setPlayer":
        return action.player;
      case "loadVideoId":
        if (currentPlayer) {
          currentPlayer.loadVideoById({
            videoId: currentVideoId,
            startSeconds: resumeTime,
          });
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
    e.target.loadVideoById({
      videoId: currentVideoId,
    });
  };

  const onEnd = () => {
    nextVideo();
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
  };
}
