'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />}
            {isLast || !item.href ? (
              <span className={cn(isLast ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text-secondary)]')}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
