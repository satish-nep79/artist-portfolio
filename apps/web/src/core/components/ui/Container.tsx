import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ref?:
    | React.RefObject<HTMLDivElement | null>
    | React.RefCallback<HTMLDivElement>;
}

const Container = ({ children, className, id, ref }: ContainerProps) => {
  return (
    <div
      ref={ref}
      id={id}
      className={`max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default Container;
