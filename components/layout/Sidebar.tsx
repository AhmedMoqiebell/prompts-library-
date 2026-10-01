'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import {
  LayoutDashboard,
  Library,
  Code2,
  PenLine,
  ImageIcon,
  Video,
  Palette,
  BarChart3,
  Heart,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prompts', label: 'All Prompts', icon: Library },
  { type: 'divider' as const, label: 'Categories' },
  { href: '/category/programming', label: 'Programming', icon: Code2 },
  { href: '/category/writing', label: 'Writing', icon: PenLine },
  { href: '/category/image-generation', label: 'Image Generation', icon: ImageIcon },
  { href: '/category/video-generation', label: 'Video Generation', icon: Video },
  { href: '/category/ui-ux-design', label: 'UI/UX & Design', icon: Palette },
  { href: '/category/research-analysis', label: 'Research & Analysis', icon: BarChart3 },
  { href: '/category/general', label: 'General / Other', icon: Layers },
  { type: 'divider' as const, label: 'Library' },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/tags', label: 'Tags', icon: Tags },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onToggle, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed top-0 start-0 bottom-0 z-40 flex flex-col bg-[var(--color-surface)] border-e border-[var(--color-border)]',
        'transition-all duration-200 ease-out',
        collapsed ? 'w-16' : 'w-64',
        'hidden lg:flex',
        className,
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-[var(--color-border)]', collapsed ? 'px-3 justify-center' : 'px-5')}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent)] flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-[var(--color-text)] tracking-tight">
              PromptVault
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5" aria-label="Main navigation">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return (
                <li key={index} className={cn('pt-4 pb-1.5', collapsed ? 'px-0' : 'px-2.5')}>
                  {!collapsed && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      {item.label}
                    </span>
                  )}
                  {collapsed && <div className="border-t border-[var(--color-border-subtle)] mx-1" />}
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
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-[var(--radius-md)] transition-colors duration-150 cursor-pointer',
                    collapsed ? 'justify-center p-2.5' : 'px-2.5 py-2',
                    isActive
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-[18px] h-[18px] shrink-0" />}
                  {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2.5 border-t border-[var(--color-border)]">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-3 w-full rounded-[var(--radius-md)] p-2 text-[var(--color-text-tertiary)]',
            'hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer',
            collapsed && 'justify-center',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
