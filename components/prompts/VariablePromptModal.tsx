'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Prompt } from '@/types/prompt';
import { extractVariables, substituteVariables, PromptVariable } from '@/lib/variables';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import { usePrompts } from '@/contexts/PromptContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AIPlatformLauncher } from './AIPlatformLauncher';
import { X, Copy, Check, RotateCcw, Sliders, Eye } from 'lucide-react';
import { cn } from '@/lib/cn';

interface VariablePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
}

export function VariablePromptModal({
  isOpen,
  onClose,
  prompt,
}: VariablePromptModalProps) {
  const { addToast } = useToast();
  const { incrementUsage } = usePrompts();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'fill' | 'preview'>('fill');

  const variables = useMemo<PromptVariable[]>(
    () => extractVariables(prompt.content),
    [prompt.content],
  );

  const initialValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const v of variables) {
      vals[v.name] = v.defaultValue;
    }
    return vals;
  }, [variables]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const assembledPrompt = useMemo(
    () => substituteVariables(prompt.content, values),
    [prompt.content, values],
  );

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(assembledPrompt);
    if (success) {
      setCopied(true);
      incrementUsage(prompt.id);
      addToast('Prompt with variables copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('Failed to copy prompt', 'error');
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    addToast('Reset to default values', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] max-w-2xl w-full max-h-[90dvh] flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-[var(--color-text)] truncate">
                Fill Prompt Variables
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {prompt.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs on Mobile/Desktop */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-2.5 pb-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)] shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="category" bgColor="bg-blue-50 text-blue-700">
              {variables.length} {variables.length === 1 ? 'Variable' : 'Variables'}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('fill')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors cursor-pointer',
                activeTab === 'fill'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
              )}
            >
              Inputs
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-colors cursor-pointer flex items-center gap-1',
                activeTab === 'preview'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
              )}
            >
              <Eye className="w-3 h-3" /> Live Preview
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'fill' ? (
            <div className="space-y-4">
              {variables.map((variable) => (
                <div key={variable.name} className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-medium text-[var(--color-text)]">
                    <span>{variable.label}</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
                      {`{{${variable.name}}}`}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={values[variable.name] || ''}
                    placeholder={variable.defaultValue || `Enter ${variable.label.toLowerCase()}...`}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [variable.name]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-base sm:text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent transition-colors"
                  />
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer py-1 px-2"
                >
                  <RotateCcw className="w-3 h-3" /> Reset to defaults
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-medium text-[var(--color-text-secondary)]">
                Assembled Prompt Output:
              </div>
              <pre
                dir="auto"
                className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-xs text-[var(--color-text)] font-sans whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto"
              >
                {assembledPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:px-6 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <AIPlatformLauncher
            promptId={prompt.id}
            getContent={() => assembledPrompt}
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Cancel
            </Button>
            <Button
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
              className="flex-1 sm:flex-initial"
            >
              {copied ? 'Copied with Values!' : 'Copy with Values'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
