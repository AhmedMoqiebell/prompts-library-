'use client';

import { useState } from 'react';
import { estimateTokens } from '@/lib/tokens';
import { cn } from '@/lib/cn';
import { Coins, Clock, Hash, ChevronDown, ChevronUp } from 'lucide-react';

interface TokenMetricsBadgeProps {
  content: string;
  className?: string;
  showCostDetails?: boolean;
}

export function TokenMetricsBadge({
  content,
  className,
  showCostDetails = false,
}: TokenMetricsBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const stats = estimateTokens(content);

  if (!content) return null;

  return (
    <div className={cn('bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3 text-xs', className)}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5" title="Estimated Tokens">
            <Hash className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>
              <strong className="font-semibold text-[var(--color-text)]">
                {stats.estimatedTokens.toLocaleString()}
              </strong>{' '}
              tokens
            </span>
          </div>

          <div className="flex items-center gap-1.5" title="Word & Character count">
            <span className="text-[var(--color-text-tertiary)]">•</span>
            <span>
              <strong className="font-semibold text-[var(--color-text)]">{stats.words}</strong> words
            </span>
            <span className="text-[var(--color-text-tertiary)]">({stats.characters} chars)</span>
          </div>

          <div className="flex items-center gap-1.5" title="Reading Time">
            <Clock className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            <span>~{stats.readingTimeMinutes} min read</span>
          </div>
        </div>

        {showCostDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium cursor-pointer transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>API Costs</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {showCostDetails && expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-2 animate-slide-in-up">
          <div className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
            Estimated Cost Per Run (Input Tokens)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {stats.costs.map((cost) => (
              <div
                key={cost.model}
                className="bg-[var(--color-bg)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-2"
              >
                <div className="text-[11px] font-medium text-[var(--color-text)]">{cost.model}</div>
                <div className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5">
                  {cost.costPerRunFormatted} <span className="text-[10px] font-normal text-[var(--color-text-tertiary)]">/ run</span>
                </div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                  ${cost.inputCostPer1KRuns} per 1k calls
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
