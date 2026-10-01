'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePrompts } from '@/contexts/PromptContext';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getCategoryMeta, SORT_OPTIONS, PROMPTS_PER_PAGE } from '@/lib/constants';
import type { CategorySlug, SortOption } from '@/types/prompt';
import { Plus, Search, FolderOpen } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = getCategoryMeta(slug as CategorySlug);
  const { prompts, searchPrompts } = usePrompts();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return searchPrompts(query, { category: slug as CategorySlug, sort });
  }, [query, sort, slug, searchPrompts, prompts]);

  const totalPages = Math.ceil(filtered.length / PROMPTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * PROMPTS_PER_PAGE, page * PROMPTS_PER_PAGE);

  const IconComp = (Icons as any)[category.icon];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: category.name }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-[var(--radius-md)] ${category.bgColor} flex items-center justify-center`}>
            <span className={category.textColor}>{IconComp ? <IconComp className="w-5 h-5" /> : null}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">{category.name}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{filtered.length} {filtered.length === 1 ? 'prompt' : 'prompts'}</p>
          </div>
        </div>
        <Link href="/prompts/new"><Button icon={<Plus className="w-4 h-4" />}>Add Prompt</Button></Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input placeholder={`Search ${category.name.toLowerCase()}...`} value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} iconStart={<Search className="w-4 h-4" />} />
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
          icon={<FolderOpen className="w-7 h-7" />}
          title={query ? 'No results' : `No ${category.name} prompts yet`}
          description={query ? `No prompts match "${query}" in ${category.name}.` : `Add your first ${category.name.toLowerCase()} prompt to get started.`}
          action={!query ? <Link href="/prompts/new"><Button icon={<Plus className="w-4 h-4" />}>Add Prompt</Button></Link> : undefined}
        />
      )}
    </div>
  );
}
