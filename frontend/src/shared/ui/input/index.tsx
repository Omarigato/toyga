import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block font-eyebrow text-[var(--text-eyebrow-size)] tracking-[0.08em] uppercase text-[var(--color-steppe)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-steppe)]">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-xl border border-[var(--color-steppe-40)] bg-[var(--color-parchment)] px-3 py-2 text-sm transition-all placeholder:text-[var(--color-steppe)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-0 focus:shadow-[var(--shadow-gold-glow)] disabled:cursor-not-allowed disabled:opacity-40",
              icon && "pl-10",
              error && "border-[var(--color-wine)] focus:border-[var(--color-wine)] focus:ring-[var(--color-wine)]",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--color-wine)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
