'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, iconStart, iconEnd, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconStart && (
            <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-[var(--color-text-tertiary)] pointer-events-none">
              {iconStart}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 px-3 text-sm rounded-[var(--radius-md)]',
              'border border-[var(--color-border)] bg-[var(--color-surface)]',
              'text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
              'transition-colors duration-150',
              'hover:border-[var(--color-border-strong)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
              iconStart && 'ps-9',
              iconEnd && 'pe-9',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {iconEnd && (
            <span className="absolute inset-y-0 end-0 flex items-center pe-3 text-[var(--color-text-tertiary)]">
              {iconEnd}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
