'use client';

import type { CategoryCorrectionSuggestion, CategorySlug } from '@/types/prompt';
import { CATEGORIES, getCategoryMeta } from '@/lib/constants';
import { Lightbulb, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CategorySuggestionBannerProps {
  suggestion: CategoryCorrectionSuggestion;
  onApplyCategory: (category: CategorySlug) => void;
}

export function CategorySuggestionBanner({
  suggestion,
  onApplyCategory,
}: CategorySuggestionBannerProps) {
  if (!suggestion.isDifferent) return null;

  const currentMeta = getCategoryMeta(suggestion.currentCategory);
  const targetMeta = getCategoryMeta(suggestion.suggestedCategory);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-[var(--radius-lg)] p-3.5 text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
      <div className="flex items-start gap-2.5">
        <div className="p-1 bg-blue-100 text-blue-700 rounded-full mt-0.5 shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-blue-900 flex items-center gap-1.5 flex-wrap">
            <span>Category Recommendation:</span>
            <span className="text-blue-700 line-through opacity-70">{currentMeta.name}</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="text-blue-950 font-bold underline decoration-blue-400">{targetMeta.name}</span>
            <span className="text-[10px] bg-blue-200/60 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
              {Math.round(suggestion.confidence * 100)}% confidence
            </span>
          </p>
          <p className="text-[11px] text-blue-800/90 leading-relaxed">
            {suggestion.reason}
          </p>
        </div>
      </div>

      <div className="shrink-0 self-end sm:self-center">
        <Button
          size="sm"
          onClick={() => onApplyCategory(suggestion.suggestedCategory)}
          icon={<Check className="w-3.5 h-3.5" />}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
        >
          Switch to {targetMeta.name}
        </Button>
      </div>
    </div>
  );
}
