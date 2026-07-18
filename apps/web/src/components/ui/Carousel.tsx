import Indicators from "@/components/ui/Indicators";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";

interface CarouselProps {
  initialIndex?: number;
  items: React.ReactNode[];
  autoPlay?: boolean;
  loop?: boolean;
}

const Carousel = ({
  initialIndex = 0,
  items,
  autoPlay = true,
  loop = true,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const autoScrollDurationInSeconds = useRef(5); // Set the auto scroll duration in seconds

  const updateTimer = (timeInSeconds?: number) => {
    autoScrollDurationInSeconds.current = timeInSeconds ?? 5; // Reset the timer to 5 seconds
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: carouselRef.current.clientWidth * index,
      behavior: "auto",
    });
    setCurrentIndex(index);
    updateTimer(5); // Reset the timer to 5 seconds
  };

  const handlePrevClick = () => {
    if (currentIndex === 0 && !loop) return;
    let newIndex = currentIndex - 1;
    if (currentIndex === 0 && loop) {
      newIndex = items!.length - 1;
    }
    scrollToIndex(newIndex);
  };

  const handleNextClick = () => {
    if (currentIndex === items!.length - 1 && !loop) return;
    let newIndex = currentIndex + 1;
    if (currentIndex === items!.length - 1 && loop) {
      newIndex = 0;
    }
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const idx = Math.round(
      carouselRef.current.scrollLeft / carouselRef.current.clientWidth,
    );
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      updateTimer(5); // Reset the timer to 5 seconds
    }
  };

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      if (
        autoScrollDurationInSeconds.current === 0 ||
        autoScrollDurationInSeconds.current < 0
      ) {
        handleNextClick();
        return;
      }
      console.log("Duration:", autoScrollDurationInSeconds.current);
      updateTimer(autoScrollDurationInSeconds.current - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoScrollDurationInSeconds, currentIndex]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <div
        onClick={handlePrevClick}
        className="z-2 absolute left-0 w-12 h-12 bg-glass-shadow border border-glass-border p-2 rounded-full hover:shadow-primary-glow transition-default"
      >
        <ArrowLeftIcon size={"100%"} className="text-text-body" />
      </div>
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="w-full h-full flex flex-row overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide scrollbar-none items-center"
      >
        {items?.map((item, index) => (
          <div
            key={index}
            className="w-full h-full shrink-0 flex snap-center"
            style={{ scrollSnapStop: "always" }}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        onClick={handleNextClick}
        className="z-2 absolute right-0 w-12 h-12 bg-glass-shadow border border-glass-border p-2 rounded-full hover:shadow-primary-glow transition-default"
      >
        <ArrowRightIcon size={"100%"} className="text-text-body" />
      </div>
      <Indicators
        activeIndex={currentIndex}
        totalIndicators={items?.length || 0}
        onIndicatorClick={(index) => scrollToIndex(index)}
      />
    </div>
  );
};

export default Carousel;
