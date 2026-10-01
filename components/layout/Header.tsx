'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Menu, User, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

import { CommandPalette } from './CommandPalette';
import { HeaderInstallButton } from '@/components/pwa/PwaInstallPrompt';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 h-16 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]',
          'flex items-center gap-4 px-4 lg:px-6',
          'transition-all duration-200',
        )}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Quick Search Button / Bar (opens Command Palette) */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            'flex-1 max-w-xl h-9 ps-3 pe-3 text-sm rounded-[var(--radius-md)]',
            'border border-[var(--color-border)] bg-[var(--color-bg)]',
            'text-[var(--color-text-tertiary)] flex items-center justify-between',
            'hover:border-[var(--color-border-strong)] transition-colors duration-150 cursor-pointer text-start',
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0" />
            <span className="truncate">{t('searchPlaceholder')}</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
            ⌘K
          </kbd>
        </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-all flex items-center gap-1.5 cursor-pointer"
          title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
        >
          <Languages className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold">{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] transition-all flex items-center justify-center cursor-pointer"
          title={resolvedTheme === 'dark' ? (language === 'ar' ? 'التحويل للوضع الفاتح' : 'Switch to Light') : (language === 'ar' ? 'التحويل للوضع الداكن' : 'Switch to Dark')}
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500 animate-scale-in" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 animate-scale-in" />
          )}
        </button>

        {/* PWA Install Button */}
        <HeaderInstallButton />

        <Button
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/prompts/new')}
        >
          <span className="hidden sm:inline">{t('addPrompt')}</span>
        </Button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] hover:ring-2 hover:ring-[var(--color-accent)]/20 transition-all cursor-pointer"
            aria-label="User menu"
            aria-expanded={profileOpen}
          >
            <User className="w-4 h-4" />
          </button>
          {profileOpen && (
            <div className="absolute end-0 top-full mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1 animate-scale-in">
              <Link
                href="/settings"
                className="block px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-[var(--color-border-subtle)] my-1" />
              <button
                className="w-full text-start px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                onClick={() => setProfileOpen(false)}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      </header>
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
