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

  useEffect(() => {
    const activeTab = tabsRef.current[activeCategory];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
      tabsRef.current[activeCategory]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Prevents the whole page from jumping vertically
        inline: "center", // Centers the clicked tab inside the scrollable container
      });
    }
  }, [activeCategory, categories]);

  return (
    <div className="relative my-8 overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none">
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
