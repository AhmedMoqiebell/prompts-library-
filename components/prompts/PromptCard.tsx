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
import { hasVariables } from '@/lib/variables';
import { VariablePromptModal } from './VariablePromptModal';
import {
  Copy,
  Check,
  Heart,
  MoreHorizontal,
  ExternalLink,
  Edit3,
  Copy as CopyIcon,
  Trash2,
  Sliders,
  FolderOpen,
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  className?: string;
}

export function PromptCard({ prompt, className }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [variableModalOpen, setVariableModalOpen] = useState(false);
  const { toggleFavorite, incrementUsage, duplicatePrompt, deletePrompt, collections, togglePromptInCollection } = usePrompts();
  const { addToast } = useToast();
  const category = getCategoryMeta(prompt.category);
  const containsVariables = hasVariables(prompt.content);

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
        '@container group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
        'hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]',
        'transition-all duration-150 cursor-pointer flex flex-col justify-between',
        className,
      )}
    >
      <Link href={`/prompts/${prompt.id}`} className="block p-4 sm:p-5 flex-1">
        {/* Top row: Category + Version + Date + Variables Badge */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="category" bgColor={category.bgColor} textColor={category.textColor}>
              {category.name}
            </Badge>
            <span className="text-[10px] font-mono font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)]">
              v{prompt.currentVersion || prompt.versions?.length || 1}
            </span>
            {containsVariables && (
              <span className="text-[10px] font-medium text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                <Sliders className="w-2.5 h-2.5" /> Template
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--color-text-tertiary)] shrink-0">
            {formatDate(prompt.createdAt)}
          </span>
        </div>

        {/* Title with dir=auto for Arabic */}
        <h3
          dir="auto"
          className="text-sm font-semibold text-[var(--color-text)] mb-1.5 line-clamp-2 leading-snug"
        >
          {prompt.title}
        </h3>

        {/* Description with dir=auto for Arabic */}
        <p
          dir="auto"
          className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2 leading-relaxed"
        >
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
      <div className="flex items-center justify-between px-4 sm:px-5 pb-3.5 sm:pb-4 pt-0 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Copy button — primary action */}
          <Button
            variant="ghost"
            size="sm"
            icon={copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
            className={cn('h-8 sm:h-7 px-2.5 sm:px-2 min-h-[32px]', copied && 'text-[var(--color-success)]')}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          {/* Interactive Variable Fill button if prompt contains {{vars}} */}
          {containsVariables && (
            <Button
              variant="outline"
              size="sm"
              icon={<Sliders className="w-3.5 h-3.5 text-amber-600" />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVariableModalOpen(true);
              }}
              className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs border-amber-500/30 hover:bg-amber-500/5 text-amber-700 dark:text-amber-300 min-h-[32px]"
            >
              Fill & Run
            </Button>
          )}

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer',
              prompt.favorite
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                : 'text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30',
            )}
            aria-label={prompt.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-4 h-4', prompt.favorite && 'fill-current')} />
          </button>
        </div>

        {/* More actions — visible on mobile/touch, hover on desktop */}
        <div className="relative">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute end-0 bottom-full mb-1 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 z-20 animate-scale-in">
                <Link
                  href={`/prompts/${prompt.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Details
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

                {/* Collections submenu */}
                {collections.length > 0 && (
                  <>
                    <div className="border-t border-[var(--color-border-subtle)] my-1" />
                    <div className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Add to Collection
                    </div>
                    {collections.map((col) => {
                      const inCol = col.promptIds.includes(prompt.id);
                      return (
                        <button
                          key={col.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            togglePromptInCollection(col.id, prompt.id);
                            addToast(
                              inCol ? `Removed from ${col.name}` : `Added to ${col.name}`,
                              'success',
                            );
                            setMenuOpen(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                        >
                          <span className="truncate">{col.name}</span>
                          {inCol && <Check className="w-3 h-3 text-[var(--color-accent)] shrink-0" />}
                        </button>
                      );
                    })}
                  </>
                )}

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

      {/* Variables Modal */}
      {variableModalOpen && (
        <VariablePromptModal
          isOpen={variableModalOpen}
          onClose={() => setVariableModalOpen(false)}
          prompt={prompt}
        />
      )}
    </article>
  );
}
