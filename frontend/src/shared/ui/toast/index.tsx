"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return React.useContext(ToastContext);
}

const accentMap: Record<ToastType, string> = {
  success: "border-l-[var(--color-gold)]",
  error: "border-l-[var(--color-wine)]",
  info: "border-l-[var(--color-tengri)]",
};

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-[var(--color-gold)]" />,
  error: <XCircle className="h-4 w-4 text-[var(--color-wine)]" />,
  info: <Info className="h-4 w-4 text-[var(--color-tengri)]" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border-l-[3px] bg-[var(--color-ink)] px-4 py-3 text-sm text-[var(--color-parchment)] shadow-lg",
                accentMap[t.type]
              )}
            >
              {iconMap[t.type]}
              <span className="flex-1">{t.message}</span>
              <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-[var(--color-steppe)] hover:text-[var(--color-parchment)]">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
