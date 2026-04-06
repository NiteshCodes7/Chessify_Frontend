"use client";

import { useToast } from "@/store/useToast";

export default function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            position: "fixed",
            top: toast.top,
            right: toast.right,
          }}
          className={`
            px-4 py-3 rounded-xl shadow-lg text-white cursor-pointer
            transition-all duration-300 min-w-64 max-w-sm
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "info" ? "bg-blue-600" : ""}
          `}
        >
          {toast.message}
        </div>
      ))}
    </>
  );
}