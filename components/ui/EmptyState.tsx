'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        'animate-fade-in',
        className,
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-border-subtle)] flex items-center justify-center mb-5">
          <span className="text-[var(--color-text-tertiary)]">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
