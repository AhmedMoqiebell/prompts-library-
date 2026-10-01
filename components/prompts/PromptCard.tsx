'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getCategoryMeta } from '@/lib/constants';
import { formatDate, truncate, copyToClipboard } from '@/lib/utils';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import type { Prompt } from '@/types/prompt';
import {
  Copy,
  Check,
  Heart,
  MoreHorizontal,
  ExternalLink,
  Edit3,
  Copy as CopyIcon,
  Trash2,
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  className?: string;
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleFavorite, incrementUsage, duplicatePrompt, deletePrompt } = usePrompts();
  const { addToast } = useToast();
  const category = getCategoryMeta(prompt.category);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      incrementUsage(prompt.id);
      addToast('Prompt copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('Failed to copy prompt', 'error');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(prompt.id);
    addToast(prompt.favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    duplicatePrompt(prompt.id);
    addToast('Prompt duplicated', 'success');
    setMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deletePrompt(prompt.id);
    addToast('Prompt deleted', 'success');
    setMenuOpen(false);
  };

  return (
    <article
      className={cn(
        'group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
        'hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]',
        'transition-all duration-150 cursor-pointer',
        className,
      )}
    >
      <Link href={`/prompts/${prompt.id}`} className="block p-5">
        {/* Top row: Category + Version + Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Badge variant="category" bgColor={category.bgColor} textColor={category.textColor}>
              {category.name}
            </Badge>
            <span className="text-[10px] font-mono font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)]">
              v{prompt.currentVersion || prompt.versions?.length || 1}
            </span>
          </div>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {formatDate(prompt.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1.5 line-clamp-2 leading-snug">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2 leading-relaxed">
          {truncate(prompt.description || prompt.content, 120)}
        </p>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {prompt.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[10px] text-[var(--color-text-tertiary)]">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Action bar */}
      <div className="flex items-center justify-between px-5 pb-4 pt-0">
        <div className="flex items-center gap-1">
          {/* Copy button — primary action */}
          <Button
            variant="ghost"
            size="sm"
            icon={copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
            className={cn('h-7 px-2', copied && 'text-[var(--color-success)]')}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            className={cn(
              'p-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer',
              prompt.favorite
                ? 'text-red-500 hover:bg-red-50'
                : 'text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50',
            )}
            aria-label={prompt.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-3.5 h-3.5', prompt.favorite && 'fill-current')} />
          </button>
        </div>

        {/* More actions */}
        <div className="relative">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute end-0 bottom-full mb-1 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 z-20 animate-scale-in">
                <Link
                  href={`/prompts/${prompt.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </Link>
                <Link
                  href={`/prompts/${prompt.id}/edit`}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
                <button
                  onClick={handleDuplicate}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  <CopyIcon className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="border-t border-[var(--color-border-subtle)] my-1" />
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-light)] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
