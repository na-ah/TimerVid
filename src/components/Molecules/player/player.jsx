import YouTube from "react-youtube";

export default function Player({ onReady, opts, onEnd, className }) {
  return (
    <YouTube
      className={`${className} w-full aspect-video`}
      opts={opts}
      onReady={onReady}
      onEnd={onEnd}
    />
  );
}
