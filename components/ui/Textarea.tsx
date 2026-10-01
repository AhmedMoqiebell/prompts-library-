'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  monospace?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, monospace, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[120px] px-3 py-2.5 text-sm rounded-[var(--radius-md)]',
            'border border-[var(--color-border)] bg-[var(--color-surface)]',
            'text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
            'transition-colors duration-150 resize-y',
            'hover:border-[var(--color-border-strong)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
            monospace && 'font-mono text-[13px] leading-relaxed',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
