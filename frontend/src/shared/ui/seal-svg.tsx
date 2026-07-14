"use client";

import { cn } from "../lib/utils";

interface SealSvgProps {
  size?: number;
  className?: string;
  animated?: boolean;
  closed?: boolean;
}

export function SealSvg({ size = 48, className, animated = false, closed = false }: SealSvgProps) {
  const strokeDasharray = animated ? 100 : undefined;
  const strokeDashoffset = closed ? 100 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[var(--color-gold)]", className)}
    >
      {/* Outer circle — the dome rim */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={animated ? { animation: "sealStroke 700ms ease-out forwards" } : undefined}
      />

      {/* Shańyraq cross — four arches meeting at center */}
      <path
        d="M50 4 C50 4, 26 26, 26 50 C26 74, 50 96, 50 96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={animated ? { animation: "sealStroke 700ms ease-out 100ms forwards" } : undefined}
      />
      <path
        d="M50 4 C50 4, 74 26, 74 50 C74 74, 50 96, 50 96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={animated ? { animation: "sealStroke 700ms ease-out 100ms forwards" } : undefined}
      />
      <path
        d="M4 50 C4 50, 26 26, 50 26 C74 26, 96 50, 96 50"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={animated ? { animation: "sealStroke 700ms ease-out 200ms forwards" } : undefined}
      />
      <path
        d="M4 50 C4 50, 26 74, 50 74 C74 74, 96 50, 96 50"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        style={animated ? { animation: "sealStroke 700ms ease-out 200ms forwards" } : undefined}
      />

      {/* Qoshqar-muiz (ram's horn) ornaments at cardinal points */}
      <path
        d="M50 8 C46 14, 42 14, 40 10 M50 8 C54 14, 58 14, 60 10"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M50 92 C46 86, 42 86, 40 90 M50 92 C54 86, 58 86, 60 90"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M8 50 C14 46, 14 42, 10 40 M8 50 C14 54, 14 58, 10 60"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M92 50 C86 46, 86 42, 90 40 M92 50 C86 54, 86 58, 90 60"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Center dot */}
      <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
