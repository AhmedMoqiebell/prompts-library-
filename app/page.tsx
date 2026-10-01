'use client';

import Link from 'next/link';
import { usePrompts } from '@/contexts/PromptContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Skeleton';
import { getCategoryMeta, CATEGORIES } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import {
  Library,
  Heart,
  TrendingUp,
  FolderOpen,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { prompts, loading, getStats, searchPrompts } = usePrompts();
  const { t } = useLanguage();
  const stats = getStats();
  const recentPrompts = searchPrompts('', { sort: 'newest' }).slice(0, 8);
  const topCategoryMeta = stats.topCategory ? getCategoryMeta(stats.topCategory as any) : null;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[120px] rounded-[var(--radius-lg)] animate-shimmer" />
          ))}
        </div>
        <SkeletonList count={4} />
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">{t('dashboard')}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{t('welcomeTitle')}</p>
          </div>
        </div>
        <EmptyState
          icon={<Sparkles className="w-7 h-7" />}
          title={t('welcomeTitle')}
          description={t('welcomeDesc')}
          action={
            <Link href="/prompts/new">
              <Button icon={<Plus className="w-4 h-4" />}>{t('addFirstPrompt')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">{t('dashboard')}</h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 sm:mt-1">
            {t('welcomeDesc')}
          </p>
        </div>
        <Link href="/prompts/new" className="self-start sm:self-auto">
          <Button icon={<Plus className="w-4 h-4" />}>{t('addPrompt')}</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
        <StatCard
          title={t('totalPrompts')}
          value={stats.total}
          icon={<Library className="w-5 h-5" />}
        />
        <StatCard
          title={t('favorites')}
          value={stats.favorites}
          icon={<Heart className="w-5 h-5" />}
        />
        <StatCard
          title={t('addedThisMonth')}
          value={stats.thisMonth}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title={t('topCategory')}
          value={topCategoryMeta?.name ?? '—'}
          icon={<FolderOpen className="w-5 h-5" />}
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text)] mb-3 sm:mb-4">{t('categories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3 stagger-children">
          {CATEGORIES.map((cat) => {
            const count = stats.categoryDistribution[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-xs)] transition-all duration-150 cursor-pointer group"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[var(--radius-md)] ${cat.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <span className={cat.textColor}>
                    {(() => {
                      const IconComp = (Icons as any)[cat.icon];
                      return IconComp ? <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : null;
                    })()}
                  </span>
                </div>
                <span className="text-xs font-medium text-[var(--color-text)] text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[var(--color-text-tertiary)]">
                  {count} {count === 1 ? t('promptCountSingle') : t('promptsCount')}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Prompts */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text)]">{t('recentPrompts')}</h2>
          <Link
            href="/prompts"
            className="flex items-center gap-1 text-xs sm:text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors py-1 px-1.5 rounded"
          >
            {t('viewAll')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 stagger-children">
          {recentPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </div>
  );
}
