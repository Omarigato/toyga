import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#C9A96E] to-[#A68B4B] text-ink hover:brightness-110 active:scale-[0.98] shadow-md hover:shadow-gold/20",
        secondary:
          "bg-[#252542] text-white hover:bg-[#2e2e54] border border-white/10 active:scale-[0.98]",
        outline:
          "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold active:scale-[0.98]",
        ghost:
          "text-white/80 hover:text-white hover:bg-white/10 active:scale-[0.98]",
        destructive:
          "bg-crimson text-white hover:bg-crimson/80 active:scale-[0.98]",
        link:
          "text-gold underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base font-bold",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
