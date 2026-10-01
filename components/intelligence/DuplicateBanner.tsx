'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DuplicateDetectionResult, SimilarPromptMatch } from '@/types/prompt';
import { AlertTriangle, Copy, ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DuplicateBannerProps {
  duplicate: DuplicateDetectionResult;
  similarPrompts: SimilarPromptMatch[];
  onCompareWith?: (promptId: string) => void;
}

export function DuplicateBanner({
  duplicate,
  similarPrompts,
  onCompareWith,
}: DuplicateBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const hasExact = duplicate.isExactDuplicate && duplicate.matchedPrompt;
  const hasSimilar = similarPrompts.length > 0;

  if (!hasExact && !hasSimilar) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Exact Duplicate Warning */}
      {hasExact && (
        <div className="bg-amber-50 border border-amber-300 rounded-[var(--radius-lg)] p-4 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 rounded-full text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Exact Duplicate Detected</span>
                <Badge variant="warning" className="text-[10px]">100% Match</Badge>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                This exact prompt already exists in your library as{' '}
                <Link
                  href={`/prompts/${duplicate.matchedPrompt!.id}`}
                  target="_blank"
                  className="font-medium underline hover:text-amber-950 inline-flex items-center gap-1"
                >
                  &ldquo;{duplicate.matchedPrompt!.title}&rdquo;
                  <ExternalLink className="w-3 h-3 inline" />
                </Link>
                . Consider updating the existing prompt or creating a new version instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Similar Prompts Card */}
      {hasSimilar && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs font-semibold text-[var(--color-text)]">
                {similarPrompts.length} Similar {similarPrompts.length === 1 ? 'Prompt' : 'Prompts'} Found in Library
              </span>
              <span className="text-[11px] text-[var(--color-text-tertiary)]">
                (preventing redundancy)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              icon={expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            >
              {expanded ? 'Hide Similar' : 'View Similar'}
            </Button>
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-2.5">
              {similarPrompts.map((match) => (
                <div
                  key={match.prompt.id}
                  className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/prompts/${match.prompt.id}`}
                        target="_blank"
                        className="text-xs font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] flex items-center gap-1 truncate"
                      >
                        {match.prompt.title}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                      <Badge variant="outline" className="text-[10px]">
                        {Math.round(match.similarityScore * 100)}% match
                      </Badge>
                      <Badge variant="default" className="text-[10px]">
                        {match.prompt.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
                      {match.matchReasons.map((r, i) => (
                        <span key={i} className="inline-flex items-center">
                          {i > 0 && <span className="mr-1 text-[var(--color-text-tertiary)]">•</span>}
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/prompts/${match.prompt.id}`}
                      target="_blank"
                      className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1"
                    >
                      Inspect Prompt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
