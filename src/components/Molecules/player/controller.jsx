import ControlButton from "../../Atoms/player/controlButton";

export default function Controller({ controller }) {
  return (
    <>
      <ControlButton
        label="play/pause"
        onClick={() => controller({ type: "play/pause" })}
      />
    </>
  );
}
