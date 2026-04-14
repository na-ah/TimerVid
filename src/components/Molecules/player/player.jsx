import YouTube from "react-youtube";

export default function Player({ onReady, opts, onEnd, onError, onStateChange, className, iframeKey }) {
  return (
    <YouTube
      key={iframeKey}
      className={className || "w-full aspect-video"}
      opts={opts}
      onReady={onReady}
      onEnd={onEnd}
      onError={onError}
      onStateChange={onStateChange}
    />
  );
}
