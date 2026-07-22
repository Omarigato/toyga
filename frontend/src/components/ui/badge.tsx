import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
  {
    variants: {
      variant: {
        gold: "bg-gold/20 border border-gold/40 text-gold",
        teal: "bg-teal/20 border border-teal/40 text-teal-300",
        crimson: "bg-crimson/20 border border-crimson/40 text-rose-300",
        rose: "bg-rose/20 border border-rose/40 text-rose-300",
        outline: "border border-white/20 text-white/70",
        secondary: "bg-white/10 text-white/80 border border-white/10",
      },
    },
    defaultVariants: {
      variant: "gold",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
