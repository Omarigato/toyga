import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-stone-900 text-white",
        gold: "bg-amber-100 text-amber-700",
        confirmed: "bg-emerald-100 text-emerald-700",
        pending: "bg-stone-100 text-stone-600",
        declined: "bg-red-100 text-red-600",
        premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        draft: "bg-stone-100 text-stone-500",
        published: "bg-emerald-100 text-emerald-700",
        muted: "bg-stone-100 text-stone-500",
        secondary: "bg-stone-100 text-stone-700",
        destructive: "bg-red-500 text-white",
        outline: "border border-stone-200 text-stone-700 bg-white",
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
