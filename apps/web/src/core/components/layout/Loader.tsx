import "@/core/styles/loader_style.css";

export type LoaderSize = "small" | "medium" | "large";

interface LoaderProps {
  size?: LoaderSize;
  customSize?: number;
}

const SIZE_MAP: Record<LoaderSize, number> = {
  small: 25,
  medium: 50,
  large: 100,
};

const Loader = ({ size, customSize }: LoaderProps) => {
  if (size && customSize !== undefined) {
    throw new Error(
      "Cannot pass both 'size' and 'customSize' to Loader component.",
    );
  }

  const dimension = customSize ?? (size ? SIZE_MAP[size] : 50);

  // Exact ratios derived from your CSS values (50px -> 12px/8px/4px, 100px -> 24px/16px/8px)
  const outerDotSize = dimension * 0.24;
  const innerDotSize = dimension * 0.16;
  const innerMargin = dimension * 0.08;

  return (
    <div
      id="custom-loader"
      className="custom-loader"
      style={
        {
          width: `${dimension}px`,
          height: `${dimension}px`,
          "--outer-dot-size": `${outerDotSize}px`,
          "--inner-dot-size": `${innerDotSize}px`,
          "--inner-margin": `${innerMargin}px`,
        } as React.CSSProperties
      }
    />
  );
};

export default Loader;
