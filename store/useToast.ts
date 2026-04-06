import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  top?: number;
  right?: number;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (
    message: string,
    type: Toast["type"],
    top?: number,
    right?: number,
  ) => void;
  removeToast: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, top, right) => {
    const id = Math.random().toString(36).slice(2);
    set((prev) => ({ toasts: [...prev.toasts, { id, message, type, top, right }] }));
    setTimeout(() => {
      set((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) })),
}));
