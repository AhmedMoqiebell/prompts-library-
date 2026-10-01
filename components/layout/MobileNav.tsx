'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { X, LayoutDashboard, Library, Code2, PenLine, ImageIcon, Video, Palette, BarChart3, Heart, Tags, Settings, Layers, Sparkles, FolderOpen } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = useMemo(
    () => [
      { href: '/', label: t('dashboard'), icon: LayoutDashboard },
      { href: '/prompts', label: t('allPrompts'), icon: Library },
      { href: '/collections', label: t('collections'), icon: FolderOpen },
      { type: 'divider' as const, label: t('categories') },
      { href: '/category/programming', label: t('cat_programming'), icon: Code2 },
      { href: '/category/writing', label: t('cat_writing'), icon: PenLine },
      { href: '/category/image-generation', label: t('cat_imageGen'), icon: ImageIcon },
      { href: '/category/video-generation', label: t('cat_videoGen'), icon: Video },
      { href: '/category/ui-ux-design', label: t('cat_uiUx'), icon: Palette },
      { href: '/category/research-analysis', label: t('cat_research'), icon: BarChart3 },
      { href: '/category/general', label: t('cat_general'), icon: Layers },
      { type: 'divider' as const, label: t('library') },
      { href: '/favorites', label: t('favorites'), icon: Heart },
      { href: '/tags', label: t('tags'), icon: Tags },
      { href: '/settings', label: t('settings'), icon: Settings },
    ],
    [t],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on path change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <nav
        className="absolute top-0 start-0 bottom-0 w-72 max-w-[85vw] bg-[var(--color-surface)] shadow-[var(--shadow-xl)] animate-slide-in-right flex flex-col"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 pt-[env(safe-area-inset-top,0px)] px-5 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent)] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-semibold text-[var(--color-text)]">PromptVault</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <ul className="p-3 flex-1 flex flex-col gap-0.5 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
          {navItems.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return (
                <li key={index} className="pt-4 pb-1.5 px-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    {item.label}
                  </span>
                </li>
              );
            }

            if (!('href' in item)) return null;
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)] min-h-[44px] transition-colors cursor-pointer',
                    isActive
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
                  )}
                >
                  {Icon && <Icon className="w-[18px] h-[18px] shrink-0" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
