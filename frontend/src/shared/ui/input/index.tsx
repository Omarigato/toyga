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
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm transition-all placeholder:text-stone-400 focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:cursor-not-allowed disabled:opacity-40",
              icon && "pl-10",
              error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
