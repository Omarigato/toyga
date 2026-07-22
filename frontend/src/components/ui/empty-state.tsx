import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-gold/30 bg-[#21213B]/60 backdrop-blur-md space-y-4 max-w-md mx-auto",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-md">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-serif font-bold text-gold">{title}</h3>
        <p className="text-xs text-white/60">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
