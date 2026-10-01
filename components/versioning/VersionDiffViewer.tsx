'use client';

import { useMemo } from 'react';
import type { PromptVersion } from '@/types/prompt';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { GitCompare, Calendar, Tag, Wrench, Layers } from 'lucide-react';

interface VersionDiffViewerProps {
  versionA: PromptVersion;
  versionB: PromptVersion;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumA?: number;
  lineNumB?: number;
}

function computeLineDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');

  const diff: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < linesA.length || j < linesB.length) {
    if (i < linesA.length && j < linesB.length && linesA[i] === linesB[j]) {
      diff.push({
        type: 'unchanged',
        content: linesA[i],
        lineNumA: i + 1,
        lineNumB: j + 1,
      });
      i++;
      j++;
    } else if (j < linesB.length && (i >= linesA.length || !linesA.slice(i).includes(linesB[j]))) {
      diff.push({
        type: 'added',
        content: linesB[j],
        lineNumB: j + 1,
      });
      j++;
    } else if (i < linesA.length) {
      diff.push({
        type: 'removed',
        content: linesA[i],
        lineNumA: i + 1,
      });
      i++;
    } else {
      break;
    }
  }

  return diff;
}

export function VersionDiffViewer({ versionA, versionB }: VersionDiffViewerProps) {
  const diffLines = useMemo(
    () => computeLineDiff(versionA.content, versionB.content),
    [versionA.content, versionB.content],
  );

  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    for (const l of diffLines) {
      if (l.type === 'added') additions++;
      if (l.type === 'removed') deletions++;
    }
    return { additions, deletions };
  }, [diffLines]);

  // Metadata differences
  const titleChanged = versionA.title !== versionB.title;
  const categoryChanged = versionA.category !== versionB.category;
  const toolChanged = versionA.tool !== versionB.tool;
  const descChanged = versionA.description !== versionB.description;

  const addedTechs = versionB.technologies.filter(
    (t) => !versionA.technologies.includes(t),
  );
  const removedTechs = versionA.technologies.filter(
    (t) => !versionB.technologies.includes(t),
  );

  const addedTags = versionB.tags.filter((t) => !versionA.tags.includes(t));
  const removedTags = versionA.tags.filter((t) => !versionB.tags.includes(t));

  return (
    <div className="space-y-6">
      {/* Diff Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)] text-[var(--color-text)]">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-2">
              <span>Comparing</span>
              <Badge variant="outline">{versionA.versionLabel}</Badge>
              <span className="text-[var(--color-text-tertiary)]">&rarr;</span>
              <Badge variant="default">{versionB.versionLabel}</Badge>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              {versionB.changes || 'No changelog description provided'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-medium border border-emerald-200">
            +{stats.additions} lines
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-mono font-medium border border-rose-200">
            -{stats.deletions} lines
          </span>
        </div>
      </div>

      {/* Metadata Differences Comparison */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Metadata Differences
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)] text-xs">
          {/* Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
            <span className="text-[var(--color-text-secondary)] font-medium">Title</span>
            <div className={`text-[var(--color-text)] ${titleChanged ? 'line-through opacity-70' : ''}`}>
              {versionA.title}
            </div>
            <div className="text-[var(--color-text)] font-semibold">
              {versionB.title}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
            <span className="text-[var(--color-text-secondary)] font-medium">Category</span>
            <div className="text-[var(--color-text)]">{versionA.category}</div>
            <div className={`text-[var(--color-text)] ${categoryChanged ? 'font-semibold text-[var(--color-accent)]' : ''}`}>
              {versionB.category}
            </div>
          </div>

          {/* Tool */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
            <span className="text-[var(--color-text-secondary)] font-medium">AI Tool</span>
            <div className="text-[var(--color-text)]">{versionA.tool || 'None'}</div>
            <div className={`text-[var(--color-text)] ${toolChanged ? 'font-semibold text-purple-700' : ''}`}>
              {versionB.tool || 'None'}
            </div>
          </div>

          {/* Technologies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
            <span className="text-[var(--color-text-secondary)] font-medium">Technologies</span>
            <div className="flex flex-wrap gap-1">
              {versionA.technologies.map((t) => (
                <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {versionB.technologies.map((t) => {
                const isNew = addedTechs.includes(t);
                return (
                  <Badge
                    key={t}
                    variant={isNew ? 'success' : 'outline'}
                    className="text-[10px]"
                  >
                    {isNew ? `+ ${t}` : t}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2">
            <span className="text-[var(--color-text-secondary)] font-medium">Tags</span>
            <div className="flex flex-wrap gap-1">
              {versionA.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {versionB.tags.map((tag) => {
                const isNew = addedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isNew ? 'success' : 'outline'}
                    className="text-[10px]"
                  >
                    {isNew ? `+ ${tag}` : tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Line-by-Line Content Diff */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          <span>Prompt Content Diff</span>
          <span className="text-[10px] font-normal normal-case text-[var(--color-text-tertiary)]">
            Green: added in {versionB.versionLabel} • Red: removed from {versionA.versionLabel}
          </span>
        </div>

        <div className="font-mono text-xs overflow-x-auto max-h-[380px] overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
          {diffLines.map((line, idx) => {
            if (line.type === 'added') {
              return (
                <div
                  key={idx}
                  className="flex items-start bg-emerald-50/80 text-emerald-950 px-3 py-1.5 border-l-4 border-emerald-500 font-mono"
                >
                  <span className="w-8 text-[var(--color-text-tertiary)] select-none shrink-0 text-right pr-2">
                    {line.lineNumB}
                  </span>
                  <span className="w-5 text-emerald-700 font-bold select-none shrink-0">
                    +
                  </span>
                  <span className="whitespace-pre-wrap flex-1 break-words">{line.content || ' '}</span>
                </div>
              );
            }
            if (line.type === 'removed') {
              return (
                <div
                  key={idx}
                  className="flex items-start bg-rose-50/80 text-rose-950 px-3 py-1.5 border-l-4 border-rose-500 font-mono line-through opacity-85"
                >
                  <span className="w-8 text-[var(--color-text-tertiary)] select-none shrink-0 text-right pr-2">
                    {line.lineNumA}
                  </span>
                  <span className="w-5 text-rose-700 font-bold select-none shrink-0">
                    -
                  </span>
                  <span className="whitespace-pre-wrap flex-1 break-words">{line.content || ' '}</span>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="flex items-start bg-transparent text-[var(--color-text)] px-3 py-1.5 hover:bg-[var(--color-bg)] transition-colors"
              >
                <span className="w-8 text-[var(--color-text-tertiary)] select-none shrink-0 text-right pr-2">
                  {line.lineNumB || line.lineNumA}
                </span>
                <span className="w-5 text-transparent select-none shrink-0"> </span>
                <span className="whitespace-pre-wrap flex-1 break-words">{line.content || ' '}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
