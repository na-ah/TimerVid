import Tutorial1 from "@/components/Atoms/tutorial/tutorial1";
import Tutorial2 from "@/components/Atoms/tutorial/tutorial2";
import Tutorial3 from "@/components/Atoms/tutorial/tutorial3";
import Tutorial4 from "@/components/Atoms/tutorial/tutorial4";
import Tutorial5 from "@/components/Atoms/tutorial/tutorial5";
import Tutorial6 from "@/components/Atoms/tutorial/tutorial6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
export default function TutorialContainer({
  isShowTutorial,
  setIsShowTutorial,
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`is-show-tutorial`, JSON.stringify(isShowTutorial));
    }
  }, [isLoaded, isShowTutorial]);

  // localStorageから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsShowTutorial = localStorage.getItem(`is-show-tutorial`);

      if (storedIsShowTutorial) {
        const parsedIsShowTutorial = JSON.parse(storedIsShowTutorial);
        setIsShowTutorial(parsedIsShowTutorial);
      }
      setIsLoaded(true);
    }
  }, []);

  return (
    <>
      {isShowTutorial && (
        <>
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <Tutorial1 />
              </CarouselItem>
              <CarouselItem>
                <Tutorial2 />
              </CarouselItem>
              <CarouselItem>
                <Tutorial3 />
              </CarouselItem>
              <CarouselItem>
                <Tutorial4 />
              </CarouselItem>
              <CarouselItem>
                <Tutorial5 />
              </CarouselItem>
              <CarouselItem>
                <Tutorial6 setIsShowTutorial={setIsShowTutorial} />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}
    </>
  );
}
