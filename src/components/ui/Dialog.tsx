import * as React from "react";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Drawer content (bottom on mobile, centered on desktop) */}
      <div className="relative z-50 w-full max-h-[90vh] overflow-y-auto rounded-t-2xl border border-background-200 bg-background-50 p-6 shadow-xl animate-in slide-in-from-bottom duration-300 sm:max-w-lg sm:rounded-xl sm:zoom-in-95 sm:duration-200">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-4 space-y-4", className)}>{children}</div>;
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 text-left", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-semibold font-heading text-foreground-900 leading-none tracking-tight", className)}>{children}</h2>;
}
