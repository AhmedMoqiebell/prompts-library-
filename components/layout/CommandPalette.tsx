'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/utils';
import { getCategoryMeta, CATEGORIES } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Plus,
  Heart,
  FolderOpen,
  Library,
  Copy,
  Check,
  Settings,
  Tags,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { prompts, incrementUsage, collections } = usePrompts();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Filter prompts
  const matchingPrompts = useMemo(() => {
    if (!query.trim()) return prompts.slice(0, 5);
    const q = query.toLowerCase().trim();
    return prompts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [prompts, query]);

  // Quick navigation items
  const navActions = useMemo(() => {
    const list = [
      { id: 'new', label: t('addPrompt'), href: '/prompts/new', icon: Plus },
      { id: 'all', label: t('allPrompts'), href: '/prompts', icon: Library },
      { id: 'fav', label: t('favorites'), href: '/favorites', icon: Heart },
      { id: 'collections', label: t('collections'), href: '/collections', icon: FolderOpen },
      { id: 'tags', label: t('tags'), href: '/tags', icon: Tags },
      { id: 'settings', label: t('settings'), href: '/settings', icon: Settings },
    ];
    if (!query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter((a) => a.label.toLowerCase().includes(q));
  }, [query, t]);

  // Keyboard navigation
  const totalItems = matchingPrompts.length + navActions.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < matchingPrompts.length) {
          const selected = matchingPrompts[selectedIndex];
          if (selected) {
            router.push(`/prompts/${selected.id}`);
            onClose();
          }
        } else {
          const actionIdx = selectedIndex - matchingPrompts.length;
          const action = navActions[actionIdx];
          if (action) {
            router.push(action.href);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalItems, selectedIndex, matchingPrompts, navActions, router, onClose]);

  const handleCopyPrompt = async (e: React.MouseEvent, p: typeof prompts[0]) => {
    e.stopPropagation();
    const success = await copyToClipboard(p.content);
    if (success) {
      setCopiedId(p.id);
      incrementUsage(p.id);
      addToast(`Copied "${p.title}"`, 'success');
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] max-w-xl w-full flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-text-tertiary)] shrink-0 me-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg)] rounded border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Prompts Section */}
          {matchingPrompts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {t('allPrompts')} ({matchingPrompts.length})
              </div>
              <div className="mt-1 space-y-0.5">
                {matchingPrompts.map((p, idx) => {
                  const isSelected = selectedIndex === idx;
                  const cat = getCategoryMeta(p.category);
                  const isCopied = copiedId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        router.push(`/prompts/${p.id}`);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs cursor-pointer transition-colors',
                        isSelected
                          ? 'bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                          : 'text-[var(--color-text-secondary)]',
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Badge variant="category" bgColor={cat.bgColor} textColor={cat.textColor} className="text-[10px] px-1.5 py-0 shrink-0">
                          {cat.name}
                        </Badge>
                        <span dir="auto" className="font-medium text-[var(--color-text)] truncate">
                          {p.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ms-2">
                        <button
                          type="button"
                          onClick={(e) => handleCopyPrompt(e, p)}
                          className="p-1 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg)] transition-colors"
                          title="Copy prompt text"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] opacity-60 rtl:rotate-180" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          {navActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {t('quickActions')}
              </div>
              <div className="mt-1 space-y-0.5">
                {navActions.map((action, idx) => {
                  const globalIdx = matchingPrompts.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        router.push(action.href);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs cursor-pointer transition-colors',
                        isSelected
                          ? 'bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                          : 'text-[var(--color-text-secondary)]',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-tertiary)]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-[var(--color-text)]">{action.label}</span>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-tertiary)]">{t('jumpTo')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-xs text-[var(--color-text-tertiary)]">
              {t('noResultsFound')} &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[10px]">
                ↑↓
              </kbd>{' '}
              {t('navigate')}
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[10px]">
                ↵
              </kbd>{' '}
              {t('select')}
            </span>
          </div>
          <span>{t('appName')} {t('quickSearch')}</span>
        </div>
      </div>
    </div>
  );
}
