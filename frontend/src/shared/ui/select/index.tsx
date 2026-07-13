import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block font-eyebrow text-[var(--text-eyebrow-size)] tracking-[0.08em] uppercase text-[var(--color-steppe)]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            "flex h-10 w-full appearance-none rounded-xl border border-[var(--color-steppe-40)] bg-[var(--color-parchment)] px-3 py-2 text-sm transition-all focus:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:shadow-[var(--shadow-gold-glow)] disabled:cursor-not-allowed disabled:opacity-40",
            error && "border-[var(--color-wine)] focus:border-[var(--color-wine)] focus:ring-[var(--color-wine)]",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-[var(--color-wine)]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
