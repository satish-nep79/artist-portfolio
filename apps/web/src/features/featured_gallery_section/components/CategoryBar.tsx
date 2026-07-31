import { useState, useEffect, useRef } from "react";
import type { Category } from "@/core/types/category_type";
interface CategoryBarProps {
  categories: Category[];
  initialCategory?: Category | null;
  onCategoryClick: (index: number) => void;
}

const CategoryBar = ({
  categories,
  initialCategory,
  onCategoryClick,
}: CategoryBarProps) => {
  const getInitialIndex = () => {
    if (!initialCategory || categories.length === 0) return 0;
    const index = categories.findIndex((c) => c.id === initialCategory.id);
    return index !== -1 ? index : 0;
  };

  const [activeCategory, setActiveCategory] =
    useState<number>(getInitialIndex());
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

      const targetScrollLeft =
        tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeCategory, categories]);

  return (
    <div
      ref={containerRef}
      className="relative my-8 overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none"
    >
      <div className="min-w-full w-fit  flex items-center gap-5 relative  border-b-4 border-glass-border">
        {categories.map((category, index) => (
          <div
            key={category.id}
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
            {category.title}
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
