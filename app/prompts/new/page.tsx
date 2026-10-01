'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { classifyPrompt } from '@/features/classifier/PromptClassifier';
import { analyzePromptQuality } from '@/features/intelligence/qualityAnalyzer';
import { detectDuplicatesAndSimilar } from '@/features/intelligence/similarityDetector';
import {
  suggestTags,
  generateTitleSuggestions,
  generateDescriptionSummary,
  suggestCategoryCorrection,
  detectToolsDetailed,
  detectTechnologiesDetailed,
} from '@/features/intelligence/smartSuggestions';
import { CATEGORIES } from '@/lib/constants';
import type { ClassificationResult, CategorySlug } from '@/types/prompt';
import { DuplicateBanner } from '@/components/intelligence/DuplicateBanner';
import { CategorySuggestionBanner } from '@/components/intelligence/CategorySuggestionBanner';
import { SmartSuggestionsPanel } from '@/components/intelligence/SmartSuggestionsPanel';
import { PromptQualityModal } from '@/components/intelligence/PromptQualityModal';
import { Sparkles, Save, RotateCcw, Wand2, ShieldCheck } from 'lucide-react';

type Phase = 'input' | 'analyzing' | 'review';

export default function NewPromptPage() {
  const router = useRouter();
  const { prompts, createPrompt } = usePrompts();
  const { addToast } = useToast();

  const [phase, setPhase] = useState<Phase>('input');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Classification state
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [editCategory, setEditCategory] = useState<CategorySlug>('general');
  const [editSubcategory, setEditSubcategory] = useState('');
  const [editTool, setEditTool] = useState('');
  const [editTechnologies, setEditTechnologies] = useState<string[]>([]);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [techInput, setTechInput] = useState('');

  // Modals state
  const [qualityModalOpen, setQualityModalOpen] = useState(false);

  // Intelligent Organization Computations
  const duplicateResult = useMemo(
    () => detectDuplicatesAndSimilar(content, prompts),
    [content, prompts],
  );

  const qualityAnalysis = useMemo(
    () => (content.trim().length > 15 ? analyzePromptQuality(content) : null),
    [content],
  );

  const categoryCorrection = useMemo(
    () => suggestCategoryCorrection(content, editCategory),
    [content, editCategory],
  );

  const tagSuggestions = useMemo(
    () => suggestTags(content, editCategory, editTags),
    [content, editCategory, editTags],
  );

  const titleSuggestions = useMemo(
    () => (content.trim().length > 15 ? generateTitleSuggestions(content, editCategory) : []),
    [content, editCategory],
  );

  const generatedDescription = useMemo(
    () => (content.trim().length > 15 ? generateDescriptionSummary(content, editCategory) : ''),
    [content, editCategory],
  );

  const detectedTools = useMemo(
    () => detectToolsDetailed(content),
    [content],
  );

  const detectedTechnologies = useMemo(
    () => detectTechnologiesDetailed(content),
    [content],
  );

  const handleAnalyze = async () => {
    if (!content.trim()) {
      addToast('Please paste a prompt first', 'warning');
      return;
    }

    setPhase('analyzing');

    // Realistic analyzing duration
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const result = classifyPrompt(content, title || undefined);
      setClassification(result);
      setEditTitle(result.title);
      setEditCategory(result.category);
      setEditSubcategory(result.subcategory);
      setEditTool(result.tool);
      setEditTechnologies(result.technologies);
      setEditTags(result.tags);
      setEditDescription(result.description);
      setPhase('review');
    } catch {
      addToast('Classification failed. Please try again.', 'error');
      setPhase('input');
    }
  };

  const handleSave = () => {
    const prompt = createPrompt({
      userId: 'local-user',
      title: editTitle || title || 'Untitled Prompt',
      content,
      description: editDescription || description,
      category: editCategory,
      subcategory: editSubcategory,
      tool: editTool,
      technologies: editTechnologies,
      tags: editTags,
      favorite: false,
    });

    addToast('Prompt saved as v1', 'success');
    router.push(`/prompts/${prompt.id}`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(',', '');
      if (tag && !editTags.includes(tag)) {
        setEditTags([...editTags, tag]);
      }
      setTagInput('');
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tech = techInput.trim().replace(',', '');
      if (tech && !editTechnologies.includes(tech)) {
        setEditTechnologies([...editTechnologies, tech]);
      }
      setTechInput('');
    }
  };

  const handleInsertTemplate = (template: string) => {
    setContent((prev) => prev.trim() + '\n\n' + template.trim());
    addToast('Inserted section template into prompt', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'All Prompts', href: '/prompts' },
          { label: 'New Prompt' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Add New Prompt</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Paste your prompt. Automatic classification, duplicate detection, and quality diagnostics run automatically.
        </p>
      </div>

      {/* Duplicate & Similar Prompt Alert Banner */}
      <DuplicateBanner
        duplicate={duplicateResult.duplicate}
        similarPrompts={duplicateResult.similarPrompts}
      />

      {/* Category Correction Banner */}
      <CategorySuggestionBanner
        suggestion={categoryCorrection}
        onApplyCategory={(newCat) => {
          setEditCategory(newCat);
          addToast(`Category updated to ${newCat}`, 'info');
        }}
      />

      {/* Input Phase */}
      {(phase === 'input' || phase === 'review') && (
        <div className="space-y-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
          <Input
            label="Title (optional)"
            placeholder="Leave blank to auto-generate"
            value={phase === 'review' ? editTitle : title}
            onChange={(e) => phase === 'review' ? setEditTitle(e.target.value) : setTitle(e.target.value)}
            hint="If empty, a title will be generated from your prompt content"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text)]">
                Prompt Content
              </label>
              {content.trim().length > 15 && (
                <button
                  type="button"
                  onClick={() => setQualityModalOpen(true)}
                  className="text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Analyze Quality
                </button>
              )}
            </div>

            <Textarea
              placeholder="Paste your prompt here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              monospace
              className="min-h-[220px]"
            />
          </div>

          {phase === 'input' && (
            <>
              <Input
                label="Description (optional)"
                placeholder="Brief description of what this prompt does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setQualityModalOpen(true)}
                  icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  disabled={!content.trim()}
                  className="w-full sm:w-auto"
                >
                  Inspect Prompt Quality
                </Button>

                <Button
                  onClick={handleAnalyze}
                  icon={<Wand2 className="w-4 h-4" />}
                  size="md"
                  disabled={!content.trim()}
                  className="w-full sm:w-auto"
                >
                  Analyze & Classify
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Smart Suggestions Panel */}
      {content.trim().length > 15 && (
        <SmartSuggestionsPanel
          tagSuggestions={tagSuggestions}
          onAddTag={(tag) => {
            if (!editTags.includes(tag)) setEditTags([...editTags, tag]);
            addToast(`Added tag "${tag}"`, 'info');
          }}
          onAddAllTags={() => {
            const combined = [...new Set([...editTags, ...tagSuggestions.map((t) => t.tag)])];
            setEditTags(combined);
            addToast(`Added ${tagSuggestions.length} tags`, 'info');
          }}
          existingTags={editTags}
          titleSuggestions={titleSuggestions}
          onSelectTitle={(t) => {
            if (phase === 'review') setEditTitle(t);
            else setTitle(t);
            addToast('Title applied', 'info');
          }}
          currentTitle={phase === 'review' ? editTitle : title}
          detectedTools={detectedTools}
          onSelectTool={(tool) => {
            setEditTool(tool);
            addToast(`Selected ${tool}`, 'info');
          }}
          currentTool={editTool}
          detectedTechnologies={detectedTechnologies}
          onAddTechnology={(tech) => {
            if (!editTechnologies.includes(tech)) {
              setEditTechnologies([...editTechnologies, tech]);
              addToast(`Added ${tech}`, 'info');
            }
          }}
          existingTechnologies={editTechnologies}
          suggestedDescription={generatedDescription}
          onUseDescription={(desc) => {
            if (phase === 'review') setEditDescription(desc);
            else setDescription(desc);
            addToast('Description applied', 'info');
          }}
          currentDescription={phase === 'review' ? editDescription : description}
        />
      )}

      {/* Phase 2: Analyzing */}
      {phase === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)]">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[var(--color-accent)]" />
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Analyzing your prompt…</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Detecting category, tools, and technologies</p>
        </div>
      )}

      {/* Phase 3: Review Classification */}
      {phase === 'review' && classification && (
        <div className="space-y-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className="text-base font-semibold text-[var(--color-text)]">Classification Results</h2>
            <Badge variant="success" className="text-[10px]">AI Generated</Badge>
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] -mt-3 mb-4">
            Review and edit the classification before saving. All fields are editable.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as CategorySlug)}
            />

            <Input
              label="Subcategory"
              value={editSubcategory}
              onChange={(e) => setEditSubcategory(e.target.value)}
              placeholder="e.g., Frontend Development"
            />

            <Input
              label="AI Tool / Model"
              value={editTool}
              onChange={(e) => setEditTool(e.target.value)}
              placeholder="e.g., ChatGPT, Midjourney"
            />

            <Input
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Technologies</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editTechnologies.map((tech) => (
                <Badge key={tech} variant="outline" removable onRemove={() => setEditTechnologies(editTechnologies.filter((t) => t !== tech))}>
                  {tech}
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add technology and press Enter"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {editTags.map((tag) => (
                <Badge key={tag} variant="outline" removable onRemove={() => setEditTags(editTags.filter((t) => t !== tag))}>
                  {tag}
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>

          {/* Purpose */}
          {classification.purpose && (
            <div className="bg-[var(--color-border-subtle)] rounded-[var(--radius-md)] p-4">
              <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">Detected Purpose</p>
              <p className="text-sm text-[var(--color-text)]">{classification.purpose}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] gap-2.5">
            <Button
              variant="ghost"
              onClick={() => setPhase('input')}
              icon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Analyze Again
            </Button>
            <Button
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
              size="md"
              className="w-full sm:w-auto"
            >
              Save Prompt (v1)
            </Button>
          </div>
        </div>
      )}

      {/* Quality Diagnostic Modal */}
      <PromptQualityModal
        open={qualityModalOpen}
        onClose={() => setQualityModalOpen(false)}
        analysis={qualityAnalysis}
        onInsertTemplate={handleInsertTemplate}
      />
    </div>
  );
}
