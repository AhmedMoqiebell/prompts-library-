'use client';

import { useState } from 'react';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { PromptCard } from '@/components/prompts/PromptCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  FolderPlus,
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import Link from 'next/link';

const COLOR_PRESETS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export default function CollectionsPage() {
  const { collections, prompts, createCollection, updateCollection, deleteCollection } = usePrompts();
  const { addToast } = useToast();

  const [selectedColId, setSelectedColId] = useState<string | null>(
    collections.length > 0 ? collections[0].id : null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editColId, setEditColId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const activeCollection = collections.find((c) => c.id === selectedColId) || collections[0];

  const collectionPrompts = activeCollection
    ? prompts.filter((p) => activeCollection.promptIds.includes(p.id))
    : [];

  const handleOpenCreate = () => {
    setEditColId(null);
    setName('');
    setDescription('');
    setColor(COLOR_PRESETS[0]);
    setModalOpen(true);
  };

  const handleOpenEdit = (col: typeof collections[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setEditColId(col.id);
    setName(col.name);
    setDescription(col.description || '');
    setColor(col.color || COLOR_PRESETS[0]);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editColId) {
      updateCollection(editColId, { name: name.trim(), description: description.trim(), color });
      addToast('Collection updated', 'success');
    } else {
      const created = createCollection(name.trim(), description.trim(), color);
      setSelectedColId(created.id);
      addToast('Collection created', 'success');
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteCollection(deleteTargetId);
    if (selectedColId === deleteTargetId) {
      const remaining = collections.filter((c) => c.id !== deleteTargetId);
      setSelectedColId(remaining.length > 0 ? remaining[0].id : null);
    }
    setDeleteTargetId(null);
    addToast('Collection deleted', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">
            Collections & Projects
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5 sm:mt-1">
            Group related prompts into projects, workflows, and custom categories
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate} className="self-start sm:self-auto">
          New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-7 h-7" />}
          title="No collections yet"
          description="Create your first collection to organize prompts for specific projects or workflows."
          action={
            <Button icon={<FolderPlus className="w-4 h-4" />} onClick={handleOpenCreate}>
              Create Collection
            </Button>
          }
        />
      ) : (
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6 items-start">
          {/* Mobile Horizontal Collections Bar */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            {collections.map((col) => {
              const isSelected = activeCollection?.id === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[40px]',
                    isSelected
                      ? 'bg-[var(--color-surface)] border-[var(--color-accent)] text-[var(--color-text)] ring-1 ring-[var(--color-accent)] shadow-xs font-semibold'
                      : 'bg-[var(--color-surface)]/80 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]',
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.color || '#3B82F6' }}
                  />
                  <span>{col.name}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-bg)] px-1.5 py-0.2 rounded-full">
                    {col.promptIds.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Sidebar of collections */}
          <div className="hidden lg:block space-y-2 lg:sticky lg:top-24">
            <div className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-2 mb-2">
              Your Collections ({collections.length})
            </div>
            {collections.map((col) => {
              const isSelected = activeCollection?.id === col.id;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className={cn(
                    'group flex items-center justify-between p-3 rounded-[var(--radius-lg)] border transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[var(--color-surface)] border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20 shadow-xs'
                      : 'bg-[var(--color-surface)]/60 border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: col.color || '#3B82F6' }}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">
                        {col.name}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-tertiary)]">
                        {col.promptIds.length} {col.promptIds.length === 1 ? 'prompt' : 'prompts'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEdit(col, e)}
                      className="p-1.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(col.id);
                      }}
                      className="p-1.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-bg)] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collection Prompts Area */}
          <div className="lg:col-span-3 space-y-4">
            {activeCollection && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: activeCollection.color || '#3B82F6' }}
                    />
                    <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] truncate">
                      {activeCollection.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {collectionPrompts.length} Prompts
                    </span>
                    {/* Mobile Edit/Delete actions for currently active collection */}
                    <div className="flex items-center lg:hidden gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(activeCollection, e)}
                        className="p-1.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                        title="Edit collection"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(activeCollection.id);
                        }}
                        className="p-1.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-bg)]"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {activeCollection.description && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                    {activeCollection.description}
                  </p>
                )}
              </div>
            )}

            {collectionPrompts.length === 0 ? (
              <div className="p-6 sm:p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] space-y-3">
                <Layers className="w-8 h-8 text-[var(--color-text-tertiary)] mx-auto" />
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  No prompts in this collection yet
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                  Browse your library or open any prompt card to add it to &quot;{activeCollection?.name}&quot;.
                </p>
                <Link href="/prompts">
                  <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Browse All Prompts
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {collectionPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Collection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSave}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] max-w-md w-full p-6 space-y-4 animate-scale-in"
          >
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              {editColId ? 'Edit Collection' : 'Create New Collection'}
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text)]">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SaaS Product Launch"
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text)]">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief purpose of this collection..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text)]">Color Tag</label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-7 h-7 rounded-full transition-transform cursor-pointer',
                      color === c && 'scale-125 ring-2 ring-offset-2 ring-[var(--color-ring)]',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {editColId ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Collection"
        description="Are you sure you want to delete this collection? Prompts inside will remain safe in your library."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
