'use client';

import { useState } from 'react';
import type { TagSuggestion, TitleSuggestion } from '@/types/prompt';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Check, Sparkles, Wand2, Wrench, Cpu, FileText } from 'lucide-react';

interface SmartSuggestionsPanelProps {
  tagSuggestions: TagSuggestion[];
  onAddTag: (tag: string) => void;
  onAddAllTags?: () => void;
  existingTags: string[];
  titleSuggestions: TitleSuggestion[];
  onSelectTitle: (title: string) => void;
  currentTitle: string;
  detectedTools: string[];
  onSelectTool: (tool: string) => void;
  currentTool: string;
  detectedTechnologies: string[];
  onAddTechnology: (tech: string) => void;
  existingTechnologies: string[];
  suggestedDescription: string;
  onUseDescription: (desc: string) => void;
  currentDescription: string;
}

export function SmartSuggestionsPanel({
  tagSuggestions,
  onAddTag,
  onAddAllTags,
  existingTags,
  titleSuggestions,
  onSelectTitle,
  currentTitle,
  detectedTools,
  onSelectTool,
  currentTool,
  detectedTechnologies,
  onAddTechnology,
  existingTechnologies,
  suggestedDescription,
  onUseDescription,
  currentDescription,
}: SmartSuggestionsPanelProps) {
  const [showTitles, setShowTitles] = useState(false);

  const availableTagSuggestions = tagSuggestions.filter(
    (s) => !existingTags.some((t) => t.toLowerCase() === s.tag.toLowerCase()),
  );

  const availableTechSuggestions = detectedTechnologies.filter(
    (tech) => !existingTechnologies.some((t) => t.toLowerCase() === tech.toLowerCase()),
  );

  if (
    availableTagSuggestions.length === 0 &&
    availableTechSuggestions.length === 0 &&
    detectedTools.length === 0 &&
    !suggestedDescription
  ) {
    return null;
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 space-y-4 shadow-xs animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider">
              Intelligent Suggestions
            </h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Contextual keywords, tags, tools, and titles detected from your prompt
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Titles */}
      {titleSuggestions.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1.5">
              <Wand2 className="w-3 h-3 text-[var(--color-accent)]" />
              Suggested Titles
            </span>
            <button
              type="button"
              onClick={() => setShowTitles(!showTitles)}
              className="text-[11px] text-[var(--color-accent)] hover:underline cursor-pointer"
            >
              {showTitles ? 'Hide Titles' : 'Browse Variants'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {titleSuggestions.slice(0, showTitles ? 3 : 1).map((s, idx) => {
              const isSelected = currentTitle === s.title;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectTitle(s.title)}
                  className={`text-xs text-left px-2.5 py-1.5 rounded-[var(--radius-md)] border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)] font-medium'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold text-[var(--color-text-tertiary)]">
                    {s.type}:
                  </span>
                  <span>{s.title}</span>
                  {isSelected ? (
                    <Check className="w-3 h-3 text-[var(--color-accent)] ml-1" />
                  ) : (
                    <Plus className="w-3 h-3 opacity-60 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggested Tags */}
      {availableTagSuggestions.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text)]">
              Tag Suggestions ({availableTagSuggestions.length})
            </span>
            {onAddAllTags && availableTagSuggestions.length > 1 && (
              <button
                type="button"
                onClick={onAddAllTags}
                className="text-[11px] text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                + Add All Tags
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableTagSuggestions.map((item) => (
              <button
                key={item.tag}
                type="button"
                onClick={() => onAddTag(item.tag)}
                title={item.reason}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-accent-light)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer group"
              >
                <Plus className="w-3 h-3 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent)] transition-colors" />
                <span>{item.tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detected AI Tools */}
      {detectedTools.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2">
          <span className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-purple-600" />
            Detected AI Tool / Model
          </span>
          <div className="flex flex-wrap gap-2">
            {detectedTools.map((t) => {
              const isSelected = currentTool === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onSelectTool(t)}
                  className={`text-xs px-2.5 py-1 rounded-[var(--radius-md)] border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-50 border-purple-400 text-purple-700 font-medium'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-purple-300'
                  }`}
                >
                  <span>{t}</span>
                  {isSelected && <Check className="w-3 h-3 text-purple-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Detected Technologies */}
      {availableTechSuggestions.length > 0 && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2">
          <span className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-blue-600" />
            Detected Technologies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableTechSuggestions.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => onAddTechnology(tech)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-blue-50/60 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3 text-blue-500" />
                <span>{tech}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Description */}
      {suggestedDescription && (!currentDescription || currentDescription !== suggestedDescription) && (
        <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text)] flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-emerald-600" />
              Generated Description Summary
            </span>
            <button
              type="button"
              onClick={() => onUseDescription(suggestedDescription)}
              className="text-[11px] text-emerald-600 hover:underline cursor-pointer font-medium"
            >
              Use Description
            </button>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg)] p-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] italic">
            &ldquo;{suggestedDescription}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
