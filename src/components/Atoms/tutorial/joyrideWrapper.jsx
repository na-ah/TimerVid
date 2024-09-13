import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Joyride from "react-joyride";

export default function JoyrideWrapper({
  steps,
  title,
  progress,
  content,
  buttonLabel,
}) {
  const [isClient, setIsClient] = useState(false);
  const [run, setRun] = useState(false);

  const startTutorial = () => {
    setRun(false);
    setTimeout(() => setRun(true), 0);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        styles={{
          options: {
            beaconSize: 120,
          },
        }}
        scrollToFirstStep={true}
        scrollOffset={350}
      />
      <div className="py-3 flex flex-col h-full justify-between">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold my-3">{title}</p>
          <p>{progress}</p>
        </div>
        <div className="flex-grow leading-loose whitespace-pre-wrap">
          {content}
        </div>
        <Button
          className="w-full mt-8"
          onClick={() => startTutorial()}
        >
          {buttonLabel}
        </Button>
      </div>
    </>
  );
}
