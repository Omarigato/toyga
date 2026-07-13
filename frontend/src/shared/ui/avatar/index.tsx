"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const sizeClasses = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base", xl: "h-16 w-16 text-lg" };

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = fallback ? fallback.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClasses[size], className)} {...props}>
      {src && !imgError ? (
        <img src={src} alt={alt || "Avatar"} className="aspect-square h-full w-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 font-medium text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

export { Avatar };
