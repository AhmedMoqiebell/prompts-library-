'use client';

import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
};

export function Modal({ open, onClose, title, description, children, className, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus trap: focus the dialog
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)]',
          'animate-scale-in overflow-y-auto max-h-[90dvh]',
          sizeStyles[size],
          className,
        )}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
            <div className="pe-2">
              {title && (
                <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center shrink-0 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
