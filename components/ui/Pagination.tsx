'use client';

import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
      </button>

      {/* Mobile compact indicator */}
      <div className="sm:hidden px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
        <span>{currentPage}</span>
        <span className="mx-1 text-[var(--color-text-tertiary)]">/</span>
        <span>{totalPages}</span>
      </div>

      {/* Desktop & Tablet Full Page Numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className="w-9 text-center text-sm text-[var(--color-text-tertiary)]">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-9 h-9 rounded-[var(--radius-md)] text-sm font-medium cursor-pointer transition-colors',
                page === currentPage
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]',
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}
