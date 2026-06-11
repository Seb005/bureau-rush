"use client";

import type { Toast } from "@/engine/gameState";

interface ToastsProps {
  toasts: Toast[];
}

export default function Toasts({ toasts }: ToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-1 items-center pointer-events-none w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-dark-blue/95 border border-neon-cyan/50 rounded-lg px-3 py-1.5 text-[8px] text-gray-100 flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,255,0.2)] animate-toast-in max-w-xs"
          style={{ opacity: Math.min(1, toast.ttl) }}
        >
          <span className="text-sm">{toast.icon}</span>
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
