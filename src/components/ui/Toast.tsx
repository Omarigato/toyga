import * as React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const ToastContext = React.createContext<{
  toast: (message: string, type?: ToastType) => void;
} | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between w-full p-4 rounded-lg shadow-lg border text-sm font-medium animate-in slide-in-from-bottom duration-300",
              t.type === "success" && "bg-emerald-50 text-emerald-800 border-emerald-200",
              t.type === "error" && "bg-red-50 text-red-800 border-red-200",
              t.type === "info" && "bg-background-50 text-foreground-800 border-background-200"
            )}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />}
              {t.type === "info" && <Info className="h-5 w-5 text-accent-600 shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export { ToastContext }
