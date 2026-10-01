'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { LayoutDashboard, Library, Plus, FolderOpen, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/prompts', label: t('allPrompts'), icon: Library },
    { href: '/prompts/new', label: t('addPrompt'), icon: Plus, isAction: true },
    { href: '/collections', label: t('collections'), icon: FolderOpen },
    { href: '/favorites', label: t('favorites'), icon: Heart },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={cn(
        'fixed bottom-0 start-0 end-0 z-40 lg:hidden',
        'bg-[var(--color-surface)]/95 backdrop-blur-md',
        'border-t border-[var(--color-border)]',
        'px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]',
        'transition-all duration-200',
      )}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : item.href !== '/' && pathname.startsWith(item.href);

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  'flex flex-col items-center justify-center -mt-4 group',
                  'min-w-[48px] min-h-[48px] focus-visible:outline-none',
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-full bg-[var(--color-accent)] text-white',
                    'flex items-center justify-center shadow-[var(--shadow-md)]',
                    'group-hover:scale-105 active:scale-95 transition-transform duration-150',
                    'ring-4 ring-[var(--color-surface)]',
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[var(--color-text-secondary)] mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-[var(--radius-md)]',
                'min-w-[54px] min-h-[44px] transition-colors duration-150',
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]',
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-150',
                    isActive && 'scale-110',
                  )}
                />
                {isActive && (
                  <span className="absolute -bottom-1 start-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 leading-none font-medium truncate max-w-[64px]',
                  isActive ? 'font-semibold text-[var(--color-accent)]' : '',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
