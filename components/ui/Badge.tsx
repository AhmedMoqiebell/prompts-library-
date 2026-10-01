'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'category' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  bgColor?: string;
  textColor?: string;
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]',
  category: '', // Uses custom bgColor/textColor
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  error: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
  outline: 'border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-transparent',
};

export function Badge({
  children,
  variant = 'default',
  className,
  bgColor,
  textColor,
  removable,
  onRemove,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-[var(--radius-sm)] whitespace-nowrap',
        variant === 'category' ? `${bgColor} ${textColor}` : variantStyles[variant],
        className,
      )}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-black/10 cursor-pointer transition-colors"
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="stroke-current">
            <path d="M1 1L7 7M7 1L1 7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
