'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
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
import type { CategorySlug } from '@/types/prompt';
import { DuplicateBanner } from '@/components/intelligence/DuplicateBanner';
import { CategorySuggestionBanner } from '@/components/intelligence/CategorySuggestionBanner';
import { SmartSuggestionsPanel } from '@/components/intelligence/SmartSuggestionsPanel';
import { PromptQualityModal } from '@/components/intelligence/PromptQualityModal';
import { Save, RotateCcw, FileText, ShieldCheck, History, Plus } from 'lucide-react';

export default function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { prompts, updatePrompt, createVersion } = usePrompts();
  const { addToast } = useToast();
  const prompt = prompts.find((p) => p.id === id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategorySlug>('general');
  const [subcategory, setSubcategory] = useState('');
  const [tool, setTool] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Versioning state
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(false);
  const [changelogNote, setChangelogNote] = useState('');
  const [qualityModalOpen, setQualityModalOpen] = useState(false);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setDescription(prompt.description);
      setCategory(prompt.category);
      setSubcategory(prompt.subcategory);
      setTool(prompt.tool);
      setTechnologies(prompt.technologies || []);
      setTags(prompt.tags || []);
    }
  }, [prompt]);

  // Intelligent Organization Computations
  const duplicateResult = useMemo(
    () => (prompt ? detectDuplicatesAndSimilar(content, prompts, prompt.id) : { duplicate: { isExactDuplicate: false }, similarPrompts: [] }),
    [content, prompts, prompt],
  );

  const qualityAnalysis = useMemo(
    () => (content.trim().length > 15 ? analyzePromptQuality(content) : null),
    [content],
  );

  const categoryCorrection = useMemo(
    () => suggestCategoryCorrection(content, category),
    [content, category],
  );

  const tagSuggestions = useMemo(
    () => suggestTags(content, category, tags),
    [content, category, tags],
  );

  const titleSuggestions = useMemo(
    () => (content.trim().length > 15 ? generateTitleSuggestions(content, category) : []),
    [content, category],
  );

  const generatedDescription = useMemo(
    () => (content.trim().length > 15 ? generateDescriptionSummary(content, category) : ''),
    [content, category],
  );

  const detectedTools = useMemo(() => detectToolsDetailed(content), [content]);
  const detectedTechnologies = useMemo(() => detectTechnologiesDetailed(content), [content]);

  if (!prompt) {
    return (
      <EmptyState
        icon={<FileText className="w-7 h-7" />}
        title="Prompt not found"
        description="This prompt may have been deleted."
        action={<Button variant="secondary" onClick={() => router.push('/prompts')}>Back to Prompts</Button>}
      />
    );
  }

  const currentVer = prompt.currentVersion || prompt.versions?.length || 1;
  const nextVer = (prompt.versions?.length || 1) + 1;

  const handleReanalyze = () => {
    const result = classifyPrompt(content, title || undefined);
    setCategory(result.category);
    setSubcategory(result.subcategory);
    setTool(result.tool);
    setTechnologies(result.technologies);
    setTags(result.tags);
    setDescription(result.description);
    addToast('Re-analyzed prompt', 'success');
  };

  const handleSave = () => {
    if (saveAsNewVersion) {
      createVersion(
        id,
        { title, content, description, category, subcategory, tool, technologies, tags },
        changelogNote || `Created version v${nextVer}`,
      );
      addToast(`Saved as new version v${nextVer}`, 'success');
    } else {
      updatePrompt(id, { title, content, description, category, subcategory, tool, technologies, tags });
      addToast('Prompt updated', 'success');
    }
    router.push(`/prompts/${id}`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(',', '');
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tech = techInput.trim().replace(',', '');
      if (tech && !technologies.includes(tech)) setTechnologies([...technologies, tech]);
      setTechInput('');
    }
  };

  const handleInsertTemplate = (template: string) => {
    setContent((prev) => prev.trim() + '\n\n' + template.trim());
    addToast('Inserted section template', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'All Prompts', href: '/prompts' },
          { label: prompt.title, href: `/prompts/${id}` },
          { label: 'Edit' },
        ]}
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Edit Prompt</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Active Revision: <span className="font-mono font-semibold text-[var(--color-text)]">v{currentVer}</span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setQualityModalOpen(true)}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        >
          Prompt Quality Analysis
        </Button>
      </div>

      {/* Duplicate & Similar Banner */}
      <DuplicateBanner
        duplicate={duplicateResult.duplicate}
        similarPrompts={duplicateResult.similarPrompts}
      />

      {/* Category Recommendation Banner */}
      <CategorySuggestionBanner
        suggestion={categoryCorrection}
        onApplyCategory={(newCat) => {
          setCategory(newCat);
          addToast(`Category updated to ${newCat}`, 'info');
        }}
      />

      {/* Form Card */}
      <div className="space-y-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text)]">Prompt Content</label>
            <button
              type="button"
              onClick={() => setQualityModalOpen(true)}
              className="text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Check Quality
            </button>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            monospace
            className="min-h-[220px]"
          />
        </div>

        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
            value={category}
            onChange={(e) => setCategory(e.target.value as CategorySlug)}
          />
          <Input label="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
          <Input label="AI Tool" value={tool} onChange={(e) => setTool(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Technologies</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {technologies.map((t) => (
              <Badge key={t} variant="outline" removable onRemove={() => setTechnologies(technologies.filter((x) => x !== t))}>
                {t}
              </Badge>
            ))}
          </div>
          <Input placeholder="Add technology, press Enter" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((t) => (
              <Badge key={t} variant="outline" removable onRemove={() => setTags(tags.filter((x) => x !== t))}>
                {t}
              </Badge>
            ))}
          </div>
          <Input placeholder="Add tag, press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} />
        </div>

        {/* Versioning Save Option */}
        <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-3">
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveAsNewVersion}
              onChange={(e) => setSaveAsNewVersion(e.target.checked)}
              className="rounded border-[var(--color-border-strong)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Save as new version (<strong>v{nextVer}</strong>) instead of overwriting v{currentVer}
            </span>
          </label>

          {saveAsNewVersion && (
            <div className="pl-6 animate-fade-in">
              <Input
                label="Changelog Summary"
                placeholder={`e.g., Version ${nextVer}: Refactored constraints and updated format`}
                value={changelogNote}
                onChange={(e) => setChangelogNote(e.target.value)}
                hint="Describe what changes were made in this version"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] gap-3">
          <Button variant="ghost" onClick={handleReanalyze} icon={<RotateCcw className="w-4 h-4" />} className="w-full sm:w-auto">
            Re-classify
          </Button>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-initial">Cancel</Button>
            <Button onClick={handleSave} icon={<Save className="w-4 h-4" />} className="flex-1 sm:flex-initial">
              {saveAsNewVersion ? `Save as v${nextVer}` : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Suggestions Panel */}
      {content.trim().length > 15 && (
        <SmartSuggestionsPanel
          tagSuggestions={tagSuggestions}
          onAddTag={(tag) => {
            if (!tags.includes(tag)) setTags([...tags, tag]);
            addToast(`Added tag "${tag}"`, 'info');
          }}
          onAddAllTags={() => {
            const combined = [...new Set([...tags, ...tagSuggestions.map((t) => t.tag)])];
            setTags(combined);
            addToast(`Added ${tagSuggestions.length} tags`, 'info');
          }}
          existingTags={tags}
          titleSuggestions={titleSuggestions}
          onSelectTitle={(t) => {
            setTitle(t);
            addToast('Title applied', 'info');
          }}
          currentTitle={title}
          detectedTools={detectedTools}
          onSelectTool={(t) => {
            setTool(t);
            addToast(`Selected ${t}`, 'info');
          }}
          currentTool={tool}
          detectedTechnologies={detectedTechnologies}
          onAddTechnology={(tech) => {
            if (!technologies.includes(tech)) {
              setTechnologies([...technologies, tech]);
              addToast(`Added ${tech}`, 'info');
            }
          }}
          existingTechnologies={technologies}
          suggestedDescription={generatedDescription}
          onUseDescription={(desc) => {
            setDescription(desc);
            addToast('Description applied', 'info');
          }}
          currentDescription={description}
        />
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
