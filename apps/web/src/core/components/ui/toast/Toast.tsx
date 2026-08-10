import { useEffect } from "react";
import {
  type ToastData,
  ToastType,
} from "@/core/components/ui/toast/toast.type";
import { toast } from "@/core/components/ui/toast/toast.store";
import {
  CheckCircleIcon,
  GearIcon,
  WarningOctagonIcon,
  InfoIcon,
} from "@phosphor-icons/react";

interface ToastProps {
  toastData: ToastData;
}

// Visual configurations mapped directly to ToastType
const TOAST_CONFIG = {
  [ToastType.SUCCESS]: {
    color: "text-success",
    shadowGlow: "shadow-success-glow",
    Icon: CheckCircleIcon,
  },
  [ToastType.ERROR]: {
    color: "text-error",
    shadowGlow: "shadow-error-glow",
    Icon: GearIcon,
  },
  [ToastType.INFO]: {
    color: "text-primary",
    shadowGlow: "shadow-primary-glow",
    Icon: InfoIcon,
  },
  [ToastType.WARNING]: {
    color: "text-warning",
    shadowGlow: "shadow-warning-glow",
    Icon: WarningOctagonIcon,
  },
};

const Toast = ({ toastData }: ToastProps) => {
  const { id, type, title, message } = toastData;

  const { color, shadowGlow, Icon } =
    TOAST_CONFIG[type] ?? TOAST_CONFIG[ToastType.INFO];

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.dismiss(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div
      className={`bg-glass-bg-2 border border-glass-border-2 py-3 px-4 flex flex-row gap-2.5 h-fit items-center ${shadowGlow} backdrop-blur-sm`}
    >
      <div>
        <Icon size={32} className={color} />
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-bold text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary">
          {message || "No message available."}
        </p>
      </div>
    </div>
  );
};

export default Toast;
