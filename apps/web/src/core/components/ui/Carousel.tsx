import Indicators from "@/core/components/ui/Indicators";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";

interface CarouselProps {
  initialIndex?: number;
  items: React.ReactNode[];
  autoPlay?: boolean;
  loop?: boolean;
  autoPlayDurationInSeconds?: number;
  className?: string;
}

const Carousel = ({
  initialIndex = 0,
  items,
  autoPlay = true,
  loop = true,
  autoPlayDurationInSeconds = 3,
  className,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const autoScrollDurationInSeconds = useRef(autoPlayDurationInSeconds); // Set the auto scroll duration in seconds

  const updateTimer = (timeInSeconds?: number) => {
    autoScrollDurationInSeconds.current = timeInSeconds ?? 3; // Reset the timer to 3 seconds
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: carouselRef.current.clientWidth * index,
      behavior: "auto",
    });
    setCurrentIndex(index);
    updateTimer(autoPlayDurationInSeconds); // Reset the timer to 3 seconds
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
      updateTimer(autoPlayDurationInSeconds); // Reset the timer to the specified durationx
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
      updateTimer(autoScrollDurationInSeconds.current - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoScrollDurationInSeconds, currentIndex]);

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center relative ${className || ""}`}
    >
      <div
        onClick={handlePrevClick}
        className="z-2 absolute left-6 w-12 h-12 bg-glass-bg border border-glass-border p-2 rounded-full hover:shadow-primary-glow transition-default"
      >
        <ArrowLeftIcon size={"100%"} className="text-glass-glow" />
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
        className="z-2 absolute right-6 w-12 h-12 bg-glass-bg border border-glass-border p-2 rounded-full hover:shadow-primary-glow transition-default"
      >
        <ArrowRightIcon size={"100%"} className="text-glass-glow" />
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
