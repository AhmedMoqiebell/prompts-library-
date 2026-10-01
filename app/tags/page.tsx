'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePrompts } from '@/contexts/PromptContext';
import { promptService } from '@/services/promptService';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Tags as TagsIcon } from 'lucide-react';

export default function TagsPage() {
  const { prompts } = usePrompts();
  const [query, setQuery] = useState('');

  const allTags = useMemo(() => {
    return promptService.getAllTags();
  }, [prompts]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allTags;
    const q = query.toLowerCase();
    return allTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [allTags, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Tags</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{allTags.length} {allTags.length === 1 ? 'tag' : 'tags'}</p>
      </div>

      {allTags.length > 0 && (
        <div className="max-w-md">
          <Input
            placeholder="Search tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            iconStart={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger-children">
          {filtered.map((tag) => (
            <Link
              key={tag.name}
              href={`/search?q=${encodeURIComponent(tag.name)}`}
              className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-xs)] transition-all duration-150 cursor-pointer"
            >
              <span className="text-sm font-medium text-[var(--color-text)]">{tag.name}</span>
              <Badge variant="default">{tag.count}</Badge>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<TagsIcon className="w-7 h-7" />}
          title={query ? 'No tags found' : 'No tags yet'}
          description={query ? `No tags match "${query}".` : 'Tags are automatically created when you add and classify prompts.'}
        />
      )}
    </div>
  );
}
