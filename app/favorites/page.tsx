'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePrompts } from '@/contexts/PromptContext';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { SORT_OPTIONS, PROMPTS_PER_PAGE } from '@/lib/constants';
import type { SortOption } from '@/types/prompt';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { prompts, searchPrompts } = usePrompts();
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  const favorites = useMemo(() => {
    return searchPrompts('', { favorite: true, sort });
  }, [sort, searchPrompts, prompts]);

  const totalPages = Math.ceil(favorites.length / PROMPTS_PER_PAGE);
  const paginated = favorites.slice((page - 1) * PROMPTS_PER_PAGE, page * PROMPTS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Favorites</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{favorites.length} {favorites.length === 1 ? 'prompt' : 'prompts'}</p>
        </div>
        <Select options={SORT_OPTIONS} value={sort} onChange={(e) => setSort(e.target.value as SortOption)} />
      </div>

      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {paginated.map((p) => <PromptCard key={p.id} prompt={p} />)}
          </div>
          <div className="flex justify-center"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      ) : (
        <EmptyState
          icon={<Heart className="w-7 h-7" />}
          title="No favorites yet"
          description="Click the heart icon on any prompt to add it to your favorites. Your most-used prompts will be easy to find here."
          action={<Link href="/prompts"><Button variant="secondary">Browse Prompts</Button></Link>}
        />
      )}
    </div>
  );
}
