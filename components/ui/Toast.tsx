'use client';

import { useToast } from '@/contexts/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-[var(--color-success)] bg-[var(--color-success-light)]',
  error: 'border-[var(--color-error)] bg-[var(--color-error-light)]',
  warning: 'border-[var(--color-warning)] bg-[var(--color-warning-light)]',
  info: 'border-[var(--color-info)] bg-[var(--color-info-light)]',
};

const iconColors = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-error)]',
  warning: 'text-[var(--color-warning)]',
  info: 'text-[var(--color-info)]',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 max-w-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] border shadow-[var(--shadow-md)]',
              'bg-[var(--color-surface)]',
              styles[toast.type],
            )}
            style={{ animation: 'toastSlideIn 250ms ease-out' }}
            role="alert"
          >
            <Icon className={cn('w-5 h-5 shrink-0', iconColors[toast.type])} />
            <p className="text-sm font-medium text-[var(--color-text)] flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
