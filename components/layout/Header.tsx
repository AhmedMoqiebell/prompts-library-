'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
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

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className={cn(
              'w-full h-9 ps-9 pe-3 text-sm rounded-[var(--radius-md)]',
              'border border-[var(--color-border)] bg-[var(--color-bg)]',
              'text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
              'hover:border-[var(--color-border-strong)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent',
              'transition-colors duration-150',
            )}
          />
          <kbd className="absolute end-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)] bg-[var(--color-border-subtle)] rounded border border-[var(--color-border)]">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/prompts/new')}
        >
          <span className="hidden sm:inline">Add Prompt</span>
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
  );
}
