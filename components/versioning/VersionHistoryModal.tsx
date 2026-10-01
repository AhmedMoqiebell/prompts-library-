'use client';

import { useState } from 'react';
import type { Prompt, PromptVersion } from '@/types/prompt';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { VersionDiffViewer } from './VersionDiffViewer';
import { formatDate } from '@/lib/utils';
import {
  History,
  GitCompare,
  Plus,
  RotateCcw,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface VersionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  prompt: Prompt;
  onRestoreVersion: (versionNumber: number) => void;
  onCreateNewVersion: (data: Partial<Prompt>, changelog: string) => void;
}

export function VersionHistoryModal({
  open,
  onClose,
  prompt,
  onRestoreVersion,
  onCreateNewVersion,
}: VersionHistoryModalProps) {
  const versions = prompt.versions || [];
  const currentVer = prompt.currentVersion || versions.length || 1;

  const [mode, setMode] = useState<'timeline' | 'compare' | 'new-version'>('timeline');
  const [selectedVerA, setSelectedVerA] = useState<number>(
    versions.length > 1 ? versions[versions.length - 2].versionNumber : 1,
  );
  const [selectedVerB, setSelectedVerB] = useState<number>(
    versions.length > 0 ? versions[versions.length - 1].versionNumber : 1,
  );

  // New version state
  const [newChangesSummary, setNewChangesSummary] = useState('');
  const [newContent, setNewContent] = useState(prompt.content);
  const [newTitle, setNewTitle] = useState(prompt.title);

  const verA = versions.find((v) => v.versionNumber === selectedVerA) || versions[0];
  const verB = versions.find((v) => v.versionNumber === selectedVerB) || versions[versions.length - 1];

  const handleCreateVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onCreateNewVersion(
      {
        content: newContent,
        title: newTitle || prompt.title,
      },
      newChangesSummary || `Version v${(versions.length || 1) + 1}`,
    );

    setNewChangesSummary('');
    setMode('timeline');
  };

  const handleStartCompare = (vNum: number) => {
    setSelectedVerA(vNum);
    setSelectedVerB(currentVer);
    setMode('compare');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Prompt Versioning & History"
      size="xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('timeline')}
              className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'timeline'
                  ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Version Timeline ({versions.length})
            </button>
            <button
              type="button"
              onClick={() => setMode('compare')}
              disabled={versions.length < 2}
              className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'compare'
                  ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare Versions
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setNewContent(prompt.content);
              setNewTitle(prompt.title);
              setNewChangesSummary('');
              setMode('new-version');
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Version v{(versions.length || 1) + 1}
          </Button>
        </div>

        {/* MODE 1: TIMELINE */}
        {mode === 'timeline' && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {versions
              .slice()
              .reverse()
              .map((v) => {
                const isCurrent = v.versionNumber === currentVer;
                return (
                  <div
                    key={v.id || v.versionNumber}
                    className={`p-4 rounded-[var(--radius-lg)] border transition-all ${
                      isCurrent
                        ? 'bg-[var(--color-surface)] border-[var(--color-accent)] shadow-xs'
                        : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[var(--color-text)]">
                            {v.versionLabel}
                          </span>
                          {isCurrent && (
                            <Badge variant="default" className="text-[10px]">
                              Active Version
                            </Badge>
                          )}
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            • {formatDate(v.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[var(--color-text)]">
                          {v.changes || 'No changelog description'}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-tertiary)] pt-1 flex-wrap">
                          <span>{v.content.split(/\s+/).length} words</span>
                          <span>•</span>
                          <span>Category: {v.category}</span>
                          {v.tool && (
                            <>
                              <span>•</span>
                              <span>Tool: {v.tool}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {versions.length > 1 && !isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartCompare(v.versionNumber)}
                            icon={<GitCompare className="w-3.5 h-3.5" />}
                          >
                            Compare with v{currentVer}
                          </Button>
                        )}
                        {!isCurrent && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              onRestoreVersion(v.versionNumber);
                              onClose();
                            }}
                            icon={<RotateCcw className="w-3.5 h-3.5" />}
                          >
                            Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* MODE 2: COMPARE */}
        {mode === 'compare' && (
          <div className="space-y-4">
            {/* Version Selectors */}
            <div className="flex items-center gap-4 bg-[var(--color-bg)] p-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Base Version (A):</span>
                <select
                  value={selectedVerA}
                  onChange={(e) => setSelectedVerA(Number(e.target.value))}
                  className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--color-text)] cursor-pointer"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      {v.versionLabel} - {formatDate(v.createdAt)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[var(--color-text-tertiary)]">&rarr;</div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Target Version (B):</span>
                <select
                  value={selectedVerB}
                  onChange={(e) => setSelectedVerB(Number(e.target.value))}
                  className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--color-text)] cursor-pointer"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      {v.versionLabel} - {formatDate(v.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {verA && verB && <VersionDiffViewer versionA={verA} versionB={verB} />}
          </div>
        )}

        {/* MODE 3: CREATE NEW VERSION */}
        {mode === 'new-version' && (
          <form onSubmit={handleCreateVersionSubmit} className="space-y-4">
            <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)]/20 p-3 rounded-[var(--radius-md)] text-xs text-[var(--color-accent)]">
              Creating <strong>Version v{(versions.length || 1) + 1}</strong> will preserve the current state and commit your new prompt adjustments.
            </div>

            <Input
              label="Version Changes Summary"
              placeholder="e.g. Added negative constraints and output schema"
              value={newChangesSummary}
              onChange={(e) => setNewChangesSummary(e.target.value)}
              required
              hint="Describe what was modified in this iteration"
            />

            <Input
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <Textarea
              label="Prompt Content for New Version"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              monospace
              className="min-h-[220px]"
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
              <Button variant="ghost" type="button" onClick={() => setMode('timeline')}>
                Cancel
              </Button>
              <Button type="submit" icon={<Plus className="w-4 h-4" />}>
                Save as v{(versions.length || 1) + 1}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
