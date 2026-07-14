import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-gold)] text-[var(--color-ink)]",
        confirmed: "bg-[var(--color-gold)] text-[var(--color-ink)]",
        pending: "border border-[var(--color-steppe)] text-[var(--color-steppe)] bg-transparent",
        declined: "border border-[var(--color-wine)] text-[var(--color-wine)] bg-transparent",
        premium: "bg-[var(--color-wine)] text-[var(--color-parchment)]",
        draft: "border border-[var(--color-steppe)] text-[var(--color-steppe)] bg-transparent",
        published: "bg-[var(--color-tengri)] text-[var(--color-parchment)]",
        muted: "bg-[var(--color-steppe-25)] text-[var(--color-steppe)]",
        secondary: "bg-[var(--color-steppe-15)] text-[var(--color-ink)]",
        destructive: "bg-[var(--color-wine)] text-[var(--color-parchment)]",
        outline: "border border-[var(--color-steppe-40)] text-[var(--color-ink)] bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
