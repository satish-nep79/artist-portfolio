import { useEffect, useRef } from "react";
import { XCircleIcon } from "@phosphor-icons/react";

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CustomDialog = ({
  isOpen,
  onClose,
  title,
  children,
}: CustomDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Prevents re-opening if already open
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = "hidden";
        dialog.focus();
        contentRef.current?.scrollTo({ top: 0 });
      }
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="overscroll-contain m-auto p-0 border-none outline-none rounded-2xl bg-transparent text-text-primary backdrop:bg-black/35 backdrop:backdrop-blur-sm max-h-[90vh] max-w-[90vw] open:flex open:flex-col shadow-nav-glow"
      onClick={(e) => {
        // Checks if the click is on the backdrop (outside the dialog content)
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className=" px-1 md:px-3 lg:px-6 py-1 md:py-3 lg:py-6 bg-bg-surface flex flex-col max-h-[90vh] max-w-[90vw] ">
        <div className="min-h-8  relative flex flex-row justify-center items-start px-12 text-center ">
          {title && <h4 className="font-display font-semibold">{title}</h4>}
          <div autoFocus tabIndex={-1} className="p-1 absolute  right-1 lg:-right-1 cursor-pointer focus:outline-none ">
            <XCircleIcon
              size={32}
              onClick={onClose}
            />
          </div>
        </div>
        <div ref={contentRef} className="overflow-y-auto overscroll-contain flex-1 min-h-0 pr-1">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default CustomDialog;
