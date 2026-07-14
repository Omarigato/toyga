"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-gold)] text-[var(--color-ink)] font-semibold shadow-md hover:bg-[var(--color-gold-hover)] hover:shadow-[var(--shadow-seal)]",
        wine:
          "border-[1.5px] border-[var(--color-wine)] text-[var(--color-wine)] bg-transparent hover:bg-[var(--color-wine-10)]",
        outline:
          "border border-[var(--color-steppe-40)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-steppe-15)]",
        secondary:
          "bg-[var(--color-steppe-15)] text-[var(--color-ink)] hover:bg-[var(--color-steppe-25)]",
        ghost:
          "text-[var(--color-ink)] hover:bg-[var(--color-gold-8)]",
        destructive:
          "bg-[var(--color-wine)] text-[var(--color-parchment)] hover:bg-[var(--color-wine-hover)]",
        link:
          "text-[var(--color-tengri)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
