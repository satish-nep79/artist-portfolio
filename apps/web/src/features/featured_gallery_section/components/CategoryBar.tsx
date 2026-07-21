import { useState, useEffect, useRef } from "react";

interface CategoryBarProps {
  categories: string[];
  initialCategory?: string;
  onCategoryClick: (index: number) => void;
}

const CategoryBar = ({
  categories,
  initialCategory = categories[0],
  onCategoryClick,
}: CategoryBarProps) => {
  const [activeCategory, setActiveCategory] = useState<number>(
    initialCategory ? categories.indexOf(initialCategory) : 0,
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeTab = tabsRef.current[activeCategory];
    const container = containerRef.current;

    if (activeTab && container) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });

      const tabOffsetLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      const containerWidth = container.clientWidth;

      const targetScrollLeft = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeCategory, categories]);

  return (
    <div
      ref={containerRef}
      className="relative my-8 overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none">
      <div className="min-w-full w-fit  flex items-center gap-5 relative  border-b-4 border-glass-border">
        {categories.map((category, index) => (
          <div
            key={category}
            ref={(el: HTMLDivElement | null) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => {
              setActiveCategory(index);
              onCategoryClick(index);
            }}
            className={`pb-2.5 px-2 cursor-pointer transition-default ${
              activeCategory === index
                ? "text-primary snap-center snap-x snap-mandatory"
                : "text-muted"
            }`}
          >
            {category}
          </div>
        ))}
      </div>
      <hr
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        className="absolute bottom-0 z-10 h-1 bg-primary p-0 border-0 transition-default"
      />
    </div>
  );
};

export default CategoryBar;
