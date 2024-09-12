import { Button } from "@mantine/core";

export default function TimerControlButton(props) {
  const { label, onClick } = props;
  return (
    <>
      <Button
        onClick={onClick}
        fullWidth
      >
        {label}
      </Button>
    </>
  );
}
