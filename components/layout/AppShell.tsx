'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleCloseMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Nav */}
      <MobileNav open={mobileNavOpen} onClose={handleCloseMobileNav} />

      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-200',
          sidebarCollapsed ? 'lg:ms-16' : 'lg:ms-64',
        )}
      >
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="px-4 lg:px-6 py-6 max-w-[1400px]">
          {children}
        </main>
      </div>
    </div>
  );
}
