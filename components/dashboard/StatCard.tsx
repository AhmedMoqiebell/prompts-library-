'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { Library, TrendingUp, Heart, FolderOpen } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, description, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5',
        'hover:border-[var(--color-border-strong)] transition-colors duration-150',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[var(--color-text-secondary)]">{title}</span>
        <span className="text-[var(--color-text-tertiary)]">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text)] tracking-tight">{value}</p>
      {description && (
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{description}</p>
      )}
    </div>
  );
}
