import { Button } from "@mantine/core";

export default function ControlButton({ label, onClick }) {
  return (
    <>
      <Button
        fullWidth
        className="shadow-md"
        color="grape"
        onClick={onClick}
      >
        {label}
      </Button>
    </>
  );
}
