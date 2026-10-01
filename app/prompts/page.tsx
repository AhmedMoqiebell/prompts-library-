'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePrompts } from '@/contexts/PromptContext';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonList } from '@/components/ui/Skeleton';
import { CATEGORIES, SORT_OPTIONS, PROMPTS_PER_PAGE } from '@/lib/constants';
import type { SortOption, CategorySlug } from '@/types/prompt';
import { Plus, Search, Library } from 'lucide-react';

export default function AllPromptsPage() {
  const { prompts, loading, searchPrompts } = usePrompts();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return searchPrompts(query, {
      sort,
      category: categoryFilter ? (categoryFilter as CategorySlug) : undefined,
    });
  }, [query, sort, categoryFilter, searchPrompts, prompts]);

  const totalPages = Math.ceil(filtered.length / PROMPTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * PROMPTS_PER_PAGE, page * PROMPTS_PER_PAGE);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-10 w-48 animate-shimmer rounded-[var(--radius-md)]" />
        <SkeletonList count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">All Prompts</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {filtered.length} {filtered.length === 1 ? 'prompt' : 'prompts'}
          </p>
        </div>
        <Link href="/prompts/new">
          <Button icon={<Plus className="w-4 h-4" />}>Add Prompt</Button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            iconStart={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))]}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          />
          <Select
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          />
        </div>
      </div>

      {/* Prompts grid */}
      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {paginated.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Library className="w-7 h-7" />}
          title={query ? 'No results found' : 'No prompts yet'}
          description={
            query
              ? `No prompts match "${query}". Try adjusting your search or filters.`
              : 'Start building your prompt library by adding your first prompt.'
          }
          action={
            !query ? (
              <Link href="/prompts/new">
                <Button icon={<Plus className="w-4 h-4" />}>Add Your First Prompt</Button>
              </Link>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
