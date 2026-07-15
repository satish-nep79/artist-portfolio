import ButtonType from "@/data/enums/ButonTypes";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  buttonType?: ButtonType;
}

const CustomButton = ({
  label,
  onClick,
  disabled = false,
  className = "",
  buttonType = ButtonType.PRIMARY,
}: CustomButtonProps) => {
  let base: string =
    "font-bold rounded-full py-3.5 px-6 transition-all duration-300 ease-in-out ";
  const hoverEffect = disabled
    ? ""
    : "hover:bg-primary hover:shadow-nav-glow hover:text-text-primary";
  if (disabled) {
    base += "opacity-50 cursor-not-allowed bg-text-secondary text-text-body ";
  } else {
    switch (buttonType) {
      case ButtonType.PRIMARY:
        base +=
          "bg-primary-60 text-text-primary font-semibold border border-glass-border";
        break;
      case ButtonType.SECONDARY:
        base +=
          "bg-glass-bg text-text-primary font-semibold border border-glass-border";
        break;
      case ButtonType.OUTLINED:
        base +=
          "bg-glass-bg-1 text-text-primary font-semibold border border-glass-border-2";
        break;
      default:
        base +=
          "bg-glass-bg text-text-primary font-semibold border border-glass-border";
        break;
    }
  }
  return (
    <button
      data-cursor={disabled ? "" : "hover"}
      className={`${base} ${hoverEffect} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CustomButton;
