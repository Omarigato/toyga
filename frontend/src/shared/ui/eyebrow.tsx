import { cn } from "../lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span className={cn("font-eyebrow text-[0.75rem] tracking-[0.08em] uppercase text-[var(--color-steppe)]", className)}>
      {children}
    </span>
  );
}
