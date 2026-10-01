'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePrompts } from '@/contexts/PromptContext';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { CATEGORIES, SORT_OPTIONS, PROMPTS_PER_PAGE } from '@/lib/constants';
import type { SortOption, CategorySlug } from '@/types/prompt';
import { Search as SearchIcon } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { prompts, searchPrompts } = usePrompts();
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setQuery(initialQuery);
    setPage(1);
  }, [initialQuery]);

  const results = useMemo(() => {
    return searchPrompts(query, {
      sort,
      category: categoryFilter ? (categoryFilter as CategorySlug) : undefined,
    });
  }, [query, sort, categoryFilter, searchPrompts, prompts]);

  const totalPages = Math.ceil(results.length / PROMPTS_PER_PAGE);
  const paginated = results.slice((page - 1) * PROMPTS_PER_PAGE, page * PROMPTS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Search</h1>
        {query && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-xl">
          <Input
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            iconStart={<SearchIcon className="w-4 h-4" />}
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))]}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          />
          <Select options={SORT_OPTIONS} value={sort} onChange={(e) => setSort(e.target.value as SortOption)} />
        </div>
      </div>

      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {paginated.map((p) => <PromptCard key={p.id} prompt={p} />)}
          </div>
          <div className="flex justify-center"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      ) : query ? (
        <EmptyState
          icon={<SearchIcon className="w-7 h-7" />}
          title="No results found"
          description={`No prompts match "${query}". Try different keywords or remove filters.`}
        />
      ) : (
        <EmptyState
          icon={<SearchIcon className="w-7 h-7" />}
          title="Search your prompts"
          description="Search across titles, content, tags, categories, and technologies."
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="animate-fade-in p-8 text-center text-[var(--color-text-secondary)]">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
