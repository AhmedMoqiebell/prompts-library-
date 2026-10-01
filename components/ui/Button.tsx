'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.97] shadow-[var(--shadow-xs)]',
  secondary:
    'bg-[var(--color-border-subtle)] text-[var(--color-text)] hover:bg-[var(--color-border)] active:scale-[0.97]',
  ghost:
    'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
  destructive:
    'bg-[var(--color-error)] text-white hover:bg-red-700 active:scale-[0.97]',
  outline:
    'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] active:scale-[0.97]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-9 px-4 text-sm gap-2 rounded-[var(--radius-md)]',
  lg: 'h-11 px-6 text-sm gap-2 rounded-[var(--radius-lg)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, icon, iconEnd, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-[var(--color-ring)] focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {iconEnd && <span className="shrink-0">{iconEnd}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
