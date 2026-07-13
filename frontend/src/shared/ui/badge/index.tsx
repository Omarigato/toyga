import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
        secondary: "border-transparent bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100",
        destructive: "border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        outline: "text-stone-950 dark:text-stone-50",
        success: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
        warning: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
