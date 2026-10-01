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

export default function DashboardPage() {
  const { prompts, loading, getStats, searchPrompts } = usePrompts();
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
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Dashboard</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Welcome to PromptVault</p>
          </div>
        </div>
        <EmptyState
          icon={<Sparkles className="w-7 h-7" />}
          title="Welcome to PromptVault"
          description="Your personal AI prompt library. Start by adding your first prompt — paste any AI prompt and we'll automatically classify and organize it for you."
          action={
            <Link href="/prompts/new">
              <Button icon={<Plus className="w-4 h-4" />}>Add Your First Prompt</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Your prompt library at a glance
          </p>
        </div>
        <Link href="/prompts/new">
          <Button icon={<Plus className="w-4 h-4" />}>Add Prompt</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Total Prompts"
          value={stats.total}
          icon={<Library className="w-5 h-5" />}
        />
        <StatCard
          title="Favorites"
          value={stats.favorites}
          icon={<Heart className="w-5 h-5" />}
        />
        <StatCard
          title="Added This Month"
          value={stats.thisMonth}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Top Category"
          value={topCategoryMeta?.name ?? '—'}
          icon={<FolderOpen className="w-5 h-5" />}
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 stagger-children">
          {CATEGORIES.map((cat) => {
            const count = stats.categoryDistribution[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-xs)] transition-all duration-150 cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-[var(--radius-md)] ${cat.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <span className={cat.textColor}>
                    {(() => {
                      const IconComp = (Icons as any)[cat.icon];
                      return IconComp ? <IconComp className="w-5 h-5" /> : null;
                    })()}
                  </span>
                </div>
                <span className="text-xs font-medium text-[var(--color-text)] text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[var(--color-text-tertiary)]">
                  {count} {count === 1 ? 'prompt' : 'prompts'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Prompts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Recent Prompts</h2>
          <Link
            href="/prompts"
            className="flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {recentPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </div>
  );
}
