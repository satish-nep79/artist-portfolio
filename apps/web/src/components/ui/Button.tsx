import ButtonType from "@/data/enums/ButonTypes";
import type { Icon } from "@phosphor-icons/react/dist/lib/index";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: Icon;
  disabled?: boolean;
  className?: string;
  buttonType?: ButtonType;
}

const Button = ({
  label,
  onClick,
  icon: Icon,
  disabled = false,
  className = "",
  buttonType,
}: ButtonProps) => {
  let base: string =
    "font-bold  rounded-full transition-all duration-300 ease-in-out ";
  const hoverEffect = disabled
    ? ""
    : "hover:bg-primary hover:shadow-nav-glow hover:text-text-primary hover:gap-3";
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
          "bg-glass-bg-1 text-primary font-semibold border border-primary";
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
      className={`px-4 py-2 md:py-3.5 md:px-6 text-[16px]  flex flex-row justify-center items-center gap-1.5 ${base} ${hoverEffect} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {Icon ? <Icon width={20} height={20} /> : null}
    </button>
  );
};

export default Button;
