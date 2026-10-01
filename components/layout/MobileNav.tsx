'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { X, LayoutDashboard, Library, Code2, PenLine, ImageIcon, Video, Palette, BarChart3, Heart, Tags, Settings, Layers, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prompts', label: 'All Prompts', icon: Library },
  { type: 'divider' as const, label: 'Categories' },
  { href: '/category/programming', label: 'Programming', icon: Code2 },
  { href: '/category/writing', label: 'Writing', icon: PenLine },
  { href: '/category/image-generation', label: 'Image Gen', icon: ImageIcon },
  { href: '/category/video-generation', label: 'Video Gen', icon: Video },
  { href: '/category/ui-ux-design', label: 'UI/UX & Design', icon: Palette },
  { href: '/category/research-analysis', label: 'Research', icon: BarChart3 },
  { href: '/category/general', label: 'General', icon: Layers },
  { type: 'divider' as const, label: 'Library' },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/tags', label: 'Tags', icon: Tags },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

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
        className="absolute top-0 start-0 bottom-0 w-72 bg-[var(--color-surface)] shadow-[var(--shadow-xl)] animate-slide-in-right"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent)] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-semibold text-[var(--color-text)]">PromptVault</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <ul className="p-3 flex flex-col gap-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-colors cursor-pointer',
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
