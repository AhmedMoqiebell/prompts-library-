'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCategoryMeta } from '@/lib/constants';
import { formatDate, copyToClipboard } from '@/lib/utils';
import { analyzePromptQuality } from '@/features/intelligence/qualityAnalyzer';
import { detectDuplicatesAndSimilar } from '@/features/intelligence/similarityDetector';
import { PromptQualityModal } from '@/components/intelligence/PromptQualityModal';
import { VersionHistoryModal } from '@/components/versioning/VersionHistoryModal';
import { DuplicateBanner } from '@/components/intelligence/DuplicateBanner';
import { VariablePromptModal } from '@/components/prompts/VariablePromptModal';
import { PromptEnhancerModal } from '@/components/intelligence/PromptEnhancerModal';
import { ShareablePromptCardModal } from '@/components/prompts/ShareablePromptCardModal';
import { TokenMetricsBadge } from '@/components/prompts/TokenMetricsBadge';
import { AIPlatformLauncher } from '@/components/prompts/AIPlatformLauncher';
import { hasVariables } from '@/lib/variables';
import {
  Copy,
  Check,
  Heart,
  Edit3,
  Trash2,
  Copy as CopyIcon,
  Calendar,
  BarChart3,
  Wrench,
  FileText,
  ShieldCheck,
  History,
  GitCompare,
  Wand2,
  Sliders,
  Share2,
} from 'lucide-react';

export default function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    prompts,
    toggleFavorite,
    incrementUsage,
    duplicatePrompt,
    deletePrompt,
    createVersion,
    restoreVersion,
    updatePrompt,
  } = usePrompts();
  const { addToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [variableOpen, setVariableOpen] = useState(false);
  const [enhancerOpen, setEnhancerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const prompt = prompts.find((p) => p.id === id);

  const hasPromptVariables = useMemo(
    () => (prompt ? hasVariables(prompt.content) : false),
    [prompt],
  );

  const qualityAnalysis = useMemo(
    () => (prompt ? analyzePromptQuality(prompt.content) : null),
    [prompt],
  );

  const similarityResult = useMemo(
    () => (prompt ? detectDuplicatesAndSimilar(prompt.content, prompts, prompt.id) : null),
    [prompt, prompts],
  );

  if (!prompt) {
    return (
      <EmptyState
        icon={<FileText className="w-7 h-7" />}
        title="Prompt not found"
        description="This prompt may have been deleted or the link is invalid."
        action={
          <Button variant="secondary" onClick={() => router.push('/prompts')}>
            Back to All Prompts
          </Button>
        }
      />
    );
  }

  const category = getCategoryMeta(prompt.category);
  const currentVer = prompt.currentVersion || prompt.versions?.length || 1;
  const versionsCount = prompt.versions?.length || 1;

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      incrementUsage(prompt.id);
      addToast('Prompt copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      addToast('Failed to copy prompt', 'error');
    }
  };

  const handleFavorite = () => {
    toggleFavorite(prompt.id);
    addToast(prompt.favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const handleDuplicate = () => {
    const dup = duplicatePrompt(prompt.id);
    if (dup) {
      addToast('Prompt duplicated', 'success');
      router.push(`/prompts/${dup.id}`);
    }
  };

  const handleDelete = () => {
    deletePrompt(prompt.id);
    addToast('Prompt deleted', 'success');
    router.push('/prompts');
  };

  const handleRestoreVersion = (verNum: number) => {
    const updated = restoreVersion(prompt.id, verNum);
    if (updated) {
      addToast(`Restored to version v${verNum}`, 'success');
    }
  };

  const handleCreateNewVersion = (data: Partial<typeof prompt>, changelog: string) => {
    const updated = createVersion(prompt.id, data, changelog);
    if (updated) {
      addToast(`Created version v${updated.currentVersion}`, 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'All Prompts', href: '/prompts' },
          { label: prompt.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight leading-tight">
              {prompt.title}
            </h1>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-2 py-0.5 rounded-full bg-[var(--color-accent-light)] border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-mono font-semibold hover:bg-[var(--color-accent)] hover:text-white transition-all cursor-pointer flex items-center gap-1"
              title="Click to view version history and diffs"
            >
              <History className="w-3 h-3" />
              v{currentVer}
              {versionsCount > 1 && (
                <span className="text-[10px] opacity-75">({versionsCount} revs)</span>
              )}
            </button>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Badge variant="category" bgColor={category.bgColor} textColor={category.textColor}>
              {category.name}
            </Badge>
            {prompt.subcategory && (
              <Badge variant="outline">{prompt.subcategory}</Badge>
            )}
            {prompt.tool && (
              <Badge variant="default">{prompt.tool}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={handleCopy}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          variant={copied ? 'secondary' : 'primary'}
        >
          {copied ? 'Copied!' : 'Copy Prompt'}
        </Button>

        {/* Dynamic Variable Filler */}
        {hasPromptVariables && (
          <Button
            variant="outline"
            onClick={() => setVariableOpen(true)}
            icon={<Sliders className="w-4 h-4 text-amber-600" />}
            className="border-amber-500/30 hover:bg-amber-500/5 text-amber-700 dark:text-amber-300"
          >
            Fill Variables & Run
          </Button>
        )}

        {/* AI Enhancer / Refiner */}
        <Button
          variant="outline"
          onClick={() => setEnhancerOpen(true)}
          icon={<Wand2 className="w-4 h-4 text-purple-600" />}
          className="border-purple-500/30 hover:bg-purple-500/5 text-purple-700 dark:text-purple-300"
        >
          AI Enhancer
        </Button>

        {/* Shareable Card Generator */}
        <Button
          variant="outline"
          onClick={() => setShareOpen(true)}
          icon={<Share2 className="w-4 h-4 text-blue-600" />}
        >
          Share Card
        </Button>

        <Button
          variant="outline"
          onClick={() => setHistoryOpen(true)}
          icon={<History className="w-4 h-4 text-[var(--color-accent)]" />}
        >
          Versions ({versionsCount})
        </Button>

        <Button
          variant="outline"
          onClick={() => setQualityOpen(true)}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        >
          Quality
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push(`/prompts/${prompt.id}/edit`)}
          icon={<Edit3 className="w-4 h-4" />}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          onClick={handleFavorite}
          icon={<Heart className={`w-4 h-4 ${prompt.favorite ? 'fill-red-500 text-red-500' : ''}`} />}
        >
          {prompt.favorite ? 'Unfavorite' : 'Favorite'}
        </Button>

        <Button variant="ghost" onClick={handleDuplicate} icon={<CopyIcon className="w-4 h-4" />}>
          Duplicate
        </Button>

        <Button
          variant="ghost"
          onClick={() => setDeleteOpen(true)}
          icon={<Trash2 className="w-4 h-4" />}
          className="text-[var(--color-error)] hover:text-[var(--color-error)]"
        >
          Delete
        </Button>
      </div>

      {/* Direct AI Platform Launchers */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <AIPlatformLauncher
          promptId={prompt.id}
          getContent={() => prompt.content}
        />
        <div className="text-[11px] text-[var(--color-text-tertiary)] hidden sm:block">
          Copies prompt and opens chat interface in a new tab
        </div>
      </div>

      {/* Similar Prompt Notice if detected */}
      {similarityResult && similarityResult.similarPrompts.length > 0 && (
        <DuplicateBanner
          duplicate={similarityResult.duplicate}
          similarPrompts={similarityResult.similarPrompts}
        />
      )}

      {/* Token Metrics & Cost Breakdown */}
      <TokenMetricsBadge
        content={prompt.content}
        showCostDetails={true}
      />

      {/* Prompt Content */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Prompt Content
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono">
              v{currentVer}
            </Badge>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors cursor-pointer"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div
          dir="auto"
          className="prompt-content text-[var(--color-text)] whitespace-pre-wrap font-mono text-sm leading-relaxed"
        >
          {prompt.content}
        </div>
      </div>

      {/* Description */}
      {prompt.description && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            Description
          </h2>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">{prompt.description}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
          Metadata & History
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prompt.tool && (
            <div>
              <dt className="text-xs text-[var(--color-text-tertiary)] mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> AI Tool
              </dt>
              <dd className="text-sm text-[var(--color-text)]">{prompt.tool}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-[var(--color-text-tertiary)] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Created
            </dt>
            <dd className="text-sm text-[var(--color-text)]">{formatDate(prompt.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-tertiary)] mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Times Used
            </dt>
            <dd className="text-sm text-[var(--color-text)]">{prompt.usageCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-tertiary)] mb-1 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Active Revision
            </dt>
            <dd className="text-sm text-[var(--color-text)] flex items-center gap-2">
              <span>v{currentVer} of {versionsCount}</span>
              <button
                onClick={() => setHistoryOpen(true)}
                className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                Compare & Diff
              </button>
            </dd>
          </div>
        </dl>

        {/* Technologies */}
        {prompt.technologies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-tertiary)] mb-2">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {prompt.technologies.map((tech) => (
                <Badge key={tech} variant="outline">{tech}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
            <p className="text-xs text-[var(--color-text-tertiary)] mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Prompt"
        description="Are you sure you want to delete this prompt? All versions will be permanently removed."
        confirmLabel="Delete"
      />

      {/* Quality Diagnostic Modal */}
      <PromptQualityModal
        open={qualityOpen}
        onClose={() => setQualityOpen(false)}
        analysis={qualityAnalysis}
      />

      {/* Version History & Diff Modal */}
      <VersionHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        prompt={prompt}
        onRestoreVersion={handleRestoreVersion}
        onCreateNewVersion={handleCreateNewVersion}
      />

      {/* Interactive Variable Fill Modal */}
      {variableOpen && (
        <VariablePromptModal
          isOpen={variableOpen}
          onClose={() => setVariableOpen(false)}
          prompt={prompt}
        />
      )}

      {/* AI Prompt Enhancer Modal */}
      {enhancerOpen && (
        <PromptEnhancerModal
          isOpen={enhancerOpen}
          onClose={() => setEnhancerOpen(false)}
          prompt={prompt}
        />
      )}

      {/* Shareable Visual Card Modal */}
      {shareOpen && (
        <ShareablePromptCardModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          prompt={prompt}
        />
      )}
    </div>
  );
}
