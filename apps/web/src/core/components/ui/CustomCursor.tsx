import { useEffect, useRef } from "react";
import "@/core/styles/CustomCursor.css"; // We will put your CSS here

const CustomCursor = () => {
  // Explicitly type the refs as HTMLDivElement
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep track of mouse positions
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId: number;

    // 1. Move the dot instantly on mousemove
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    // 2. Smoothly animate the ring following the dot
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      animationFrameId = requestAnimationFrame(animateRing);
    };

    // 3. Hover effect listeners (delegated to document for dynamic React pages)
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="hover"]')) {
        ringRef.current?.classList.add("hover");
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="hover"]')) {
        ringRef.current?.classList.remove("hover");
      }
    };

    // Attach listeners
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    // Start animation loop
    animationFrameId = requestAnimationFrame(animateRing);

    // Clean up event listeners on unmount (Crucial for React!)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" id="cursorRing" />
      <div ref={dotRef} className="cursor-dot" id="cursorDot" />
    </>
  );
};

export default CustomCursor;
