import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ src, fallback, size = "md", className }: AvatarProps) {
  const initials = fallback
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={fallback || "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-wine)] font-semibold text-[var(--color-parchment)]">
          {initials || "?"}
        </div>
      )}
    </div>
  );
}
