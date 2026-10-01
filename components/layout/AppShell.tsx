'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleCloseMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[var(--color-bg)] flex flex-col">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer Nav */}
      <MobileNav open={mobileNavOpen} onClose={handleCloseMobileNav} />

      {/* Main content area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-200',
          sidebarCollapsed ? 'lg:ms-16' : 'lg:ms-64',
        )}
      >
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        {/* pb-24 on mobile ensures no content is clipped behind the mobile BottomNav */}
        <main className="flex-1 px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Ergonomic Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
