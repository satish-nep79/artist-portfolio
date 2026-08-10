import { ToastType, type ToastData } from "@/core/components/ui/toast/toast.type";

type Listener = (toast: ToastData) => void;

let toasts: ToastData[] = [];
const listeners = new Set<Listener>();

const notify = () => {
    listeners.forEach((listener) => listener(toasts[toasts.length - 1]));
}

// const generateId = () => crypto.randomUUID();
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const addToast = (
    type: ToastType,
    title: string,
    message?: string,
) => {
    const toast: ToastData = {
        id: generateId(),
        type,
        title,
        message,
    };

    toasts = [...toasts, toast];
    notify();
    return toast.id;
};

const removeToast = (id: string) => {
    toasts = toasts.filter((toast) => toast.id !== id);
    notify();
};

const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getToasts = () => toasts;

interface ToastProps{
    title: string;
    message?: string;
}

export const toast = {
    success: ({title, message}: ToastProps) => addToast(ToastType.SUCCESS, title, message),
    error: ({title, message}: ToastProps) => addToast(ToastType.ERROR, title, message),
    warning: ({title, message}: ToastProps) => addToast(ToastType.WARNING, title, message),
    info: ({title, message}: ToastProps) => addToast(ToastType.INFO, title, message),
    dismiss: removeToast,
};

export const toastStore = {
    subscribe,
    getToasts,
};
