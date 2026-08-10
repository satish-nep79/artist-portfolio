export const ToastType = {
    SUCCESS: 1,
    ERROR: 2,
    INFO: 3,
    WARNING: 4,
} as const;

export type ToastType = (typeof ToastType)[keyof typeof ToastType];

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

