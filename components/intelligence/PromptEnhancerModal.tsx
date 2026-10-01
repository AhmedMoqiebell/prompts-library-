'use client';

import { useState, useMemo } from 'react';
import type { Prompt } from '@/types/prompt';
import { enhancePrompt, EnhancementStyle } from '@/features/intelligence/promptEnhancer';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AIPlatformLauncher } from '@/components/prompts/AIPlatformLauncher';
import { Sparkles, Check, Copy, Wand2, X, ArrowRight, Layers, Zap, Compass } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PromptEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
  onApplied?: () => void;
}

export function PromptEnhancerModal({
  isOpen,
  onClose,
  prompt,
  onApplied,
}: PromptEnhancerModalProps) {
  const { createVersion } = usePrompts();
  const { addToast } = useToast();
  const [style, setStyle] = useState<EnhancementStyle>('structured');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'enhanced' | 'original'>('enhanced');

  const result = useMemo(
    () => enhancePrompt(prompt.content, prompt.category, style, prompt.title),
    [prompt.content, prompt.category, prompt.title, style],
  );

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(result.enhancedContent);
    if (success) {
      setCopied(true);
      addToast('Enhanced prompt copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyAsVersion = () => {
    const summary = `AI Optimization: ${style.charAt(0).toUpperCase() + style.slice(1)} framework applied`;
    const updated = createVersion(
      prompt.id,
      {
        content: result.enhancedContent,
      },
      summary,
    );

    if (updated) {
      addToast(`Applied as Version v${updated.currentVersion}!`, 'success');
      onApplied?.();
      onClose();
    } else {
      addToast('Failed to apply version', 'error');
    }
  };

  const styles: { id: EnhancementStyle; name: string; desc: string; icon: any }[] = [
    {
      id: 'structured',
      name: 'Structured & Strict',
      desc: 'Role, Context, Constraints, and Output Format',
      icon: Layers,
    },
    {
      id: 'concise',
      name: 'Concise & Fast',
      desc: 'Zero-filler, token-efficient direct instructions',
      icon: Zap,
    },
    {
      id: 'creative',
      name: 'Creative & Deep',
      desc: 'Multi-perspective, exploratory, and nuanced',
      icon: Compass,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] max-w-3xl w-full max-h-[92vh] flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2">
                AI Prompt Enhancer
                <Badge variant="category" bgColor="bg-purple-50 text-purple-700">
                  Refiner
                </Badge>
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Transform raw prompt into a production-grade engineered prompt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selection Bar */}
        <div className="p-4 bg-[var(--color-bg)] border-b border-[var(--color-border-subtle)] space-y-2">
          <div className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
            Select Optimization Framework
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {styles.map((s) => {
              const Icon = s.icon;
              const isSelected = style === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    'flex flex-col text-start p-2.5 rounded-[var(--radius-md)] border transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[var(--color-surface)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 shadow-xs'
                      : 'bg-[var(--color-surface)]/60 border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                  )}
                >
                  <div className="flex items-center gap-1.5 font-medium text-xs text-[var(--color-text)]">
                    <Icon className={cn('w-3.5 h-3.5', isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]')} />
                    <span>{s.name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-secondary)] mt-1 line-clamp-1">
                    {s.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Key Improvements */}
          <div className="bg-purple-500/5 border border-purple-500/15 rounded-[var(--radius-lg)] p-3">
            <div className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Key Architectural Improvements:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-purple-950 dark:text-purple-200">
              {result.keyImprovements.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle View */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              Adopted Role: <strong className="text-[var(--color-text)] font-semibold">{result.roleAdopted}</strong>
            </span>
            <div className="flex items-center gap-1 bg-[var(--color-bg)] p-0.5 rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <button
                onClick={() => setActiveTab('enhanced')}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer',
                  activeTab === 'enhanced'
                    ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                )}
              >
                Enhanced Version
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer',
                  activeTab === 'original'
                    ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                )}
              >
                Original
              </button>
            </div>
          </div>

          {/* Preview Box */}
          <pre
            dir="auto"
            className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-xs text-[var(--color-text)] font-sans whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto"
          >
            {activeTab === 'enhanced' ? result.enhancedContent : prompt.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <AIPlatformLauncher
            promptId={prompt.id}
            getContent={() => result.enhancedContent}
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={handleApplyAsVersion}
            >
              Save as New Version
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
