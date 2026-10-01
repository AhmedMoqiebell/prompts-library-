'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-text)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 sm:h-9 ps-3 pe-9 text-base sm:text-sm rounded-[var(--radius-md)] appearance-none',
              'border border-[var(--color-border)] bg-[var(--color-surface)]',
              'text-[var(--color-text)] cursor-pointer',
              'transition-colors duration-150',
              'hover:border-[var(--color-border-strong)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
