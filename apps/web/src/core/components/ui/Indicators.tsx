interface IndicatorsProps {
  activeIndex: number;
  totalIndicators: number;
  onIndicatorClick?: (index: number) => void;
}

const Indicators = ({
  activeIndex,
  totalIndicators,
  onIndicatorClick,
}: IndicatorsProps) => {
  return (
    <div className="flex flex-row gap-2 mt-4 md:mt-6 justify-center items-center">
      {Array.from({ length: totalIndicators }, (_, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            onClick={() => onIndicatorClick && onIndicatorClick(i)}
            className={`${isActive ? "w-6" : "w-2"} h-2 rounded-full ${isActive ? "bg-primary" : "bg-glass-bg"} border border-glass-bg-2 transition-default`}
          ></div>
        );
      })}
    </div>
  );
};

export default Indicators;
