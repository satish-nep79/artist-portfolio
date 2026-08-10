import { useSyncExternalStore } from "react";

import { toastStore } from "./toast.store";
import Toast from "@/core/components/ui/toast/Toast";

const ToastContainer = () => {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getToasts,
  );

  return (
    <div className="fixed right-6 bottom-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toastData={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
