'use client';

import { useState } from 'react';
import type { PromptQualityAnalysis } from '@/types/prompt';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface PromptQualityModalProps {
  open: boolean;
  onClose: () => void;
  analysis: PromptQualityAnalysis | null;
  onInsertTemplate?: (template: string) => void;
}

export function PromptQualityModal({
  open,
  onClose,
  analysis,
  onInsertTemplate,
}: PromptQualityModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'detected' | 'missing' | 'warnings'>('all');

  if (!analysis) return null;

  const totalDetected = analysis.detected.length;
  const totalMissing = analysis.missing.length;
  const totalWarnings = analysis.warnings.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Prompt Quality Analysis"
      size="xl"
    >
      <div className="space-y-6">
        {/* Methodological Transparency Header (No arbitrary scores) */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Instructional Quality Diagnostic
              </span>
              <Badge variant="outline" className="text-[10px]">
                8 Dimensions Evaluated
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Evaluates role definition, structural delimiters, clarity, constraints, context, and format. Actionable findings without arbitrary numeric scores.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-[var(--radius-md)] text-emerald-800">
              <div className="text-base font-bold">{totalDetected}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider">Detected</div>
            </div>
            <div className="text-center px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] text-amber-800">
              <div className="text-base font-bold">{totalMissing}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider">Missing</div>
            </div>
            {totalWarnings > 0 && (
              <div className="text-center px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-[var(--radius-md)] text-rose-800">
                <div className="text-base font-bold">{totalWarnings}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider">Warnings</div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--color-text)] text-[var(--color-surface)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]'
            }`}
          >
            All Findings ({totalDetected + totalMissing + totalWarnings})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('detected')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'detected'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Detected ({totalDetected})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'missing'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Missing Context ({totalMissing})
          </button>
          {totalWarnings > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('warnings')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'warnings'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Ambiguities ({totalWarnings})
            </button>
          )}
        </div>

        {/* Findings List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Missing Findings (High Priority) */}
          {(activeTab === 'all' || activeTab === 'missing') && analysis.missing.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing Elements ({analysis.missing.length})
              </h4>
              {analysis.missing.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-[var(--radius-lg)] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-amber-950">{item.title}</span>
                        <Badge variant="warning" className="text-[9px] uppercase">Missing</Badge>
                      </div>
                      <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">{item.detail}</p>
                    </div>

                    {onInsertTemplate && item.insertableTemplate && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onInsertTemplate(item.insertableTemplate!)}
                        icon={<Plus className="w-3.5 h-3.5 text-amber-700" />}
                        className="text-xs shrink-0 bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                      >
                        Insert Section
                      </Button>
                    )}
                  </div>

                  {item.suggestedAction && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium">
                      <ArrowRight className="w-3 h-3 shrink-0 text-amber-600" />
                      <span>Recommendation: {item.suggestedAction}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Ambiguity Warnings */}
          {(activeTab === 'all' || activeTab === 'warnings') && analysis.warnings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Ambiguous Phrasing ({analysis.warnings.length})
              </h4>
              {analysis.warnings.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-rose-50/60 border border-rose-200 rounded-[var(--radius-lg)] space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-rose-950">{item.title}</span>
                    <Badge variant="error" className="text-[9px] uppercase">Warning</Badge>
                  </div>
                  <p className="text-xs text-rose-900/90 leading-relaxed">{item.detail}</p>
                  {item.suggestedAction && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-800 font-medium pt-1">
                      <ArrowRight className="w-3 h-3 shrink-0 text-rose-600" />
                      <span>{item.suggestedAction}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Detected Elements (Strengths) */}
          {(activeTab === 'all' || activeTab === 'detected') && analysis.detected.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Detected Elements ({analysis.detected.length})
              </h4>
              {analysis.detected.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-[var(--radius-lg)] space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-emerald-950">{item.title}</span>
                    <Badge variant="success" className="text-[9px] uppercase">Detected</Badge>
                  </div>
                  <p className="text-xs text-emerald-900/90 leading-relaxed">{item.detail}</p>
                  {item.snippet && (
                    <div className="mt-1 text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-[var(--radius-sm)] truncate">
                      {item.snippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            Analyzed {new Date(analysis.analyzedAt).toLocaleTimeString()}
          </span>
          <Button variant="secondary" onClick={onClose}>
            Close Diagnostic
          </Button>
        </div>
      </div>
    </Modal>
  );
}
