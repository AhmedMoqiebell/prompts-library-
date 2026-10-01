'use client';

import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {variant === 'destructive' && (
          <div className="w-12 h-12 rounded-full bg-[var(--color-error-light)] flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-[var(--color-error)]" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-sm">{description}</p>
        <div className="flex items-center gap-3 mt-6 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
