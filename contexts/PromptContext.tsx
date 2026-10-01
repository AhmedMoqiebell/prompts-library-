'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Prompt, FilterOptions, Collection } from '@/types/prompt';
import { promptService } from '@/services/promptService';

interface PromptContextValue {
  prompts: Prompt[];
  collections: Collection[];
  loading: boolean;
  refresh: () => void;
  createPrompt: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'currentVersion' | 'versions'>) => Prompt;
  updatePrompt: (id: string, data: Partial<Prompt>) => Prompt | null;
  createVersion: (id: string, data: Partial<Prompt>, changesSummary?: string) => Prompt | null;
  restoreVersion: (id: string, versionNumber: number) => Prompt | null;
  deletePrompt: (id: string) => boolean;
  toggleFavorite: (id: string) => Prompt | null;
  incrementUsage: (id: string) => void;
  duplicatePrompt: (id: string) => Prompt | null;
  searchPrompts: (query: string, filters?: FilterOptions) => Prompt[];
  getStats: () => ReturnType<typeof promptService.getStats>;
  createCollection: (name: string, description?: string, color?: string) => Collection;
  updateCollection: (id: string, data: Partial<Collection>) => Collection | null;
  deleteCollection: (id: string) => boolean;
  togglePromptInCollection: (collectionId: string, promptId: string) => boolean;
}

const PromptContext = createContext<PromptContextValue | null>(null);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setPrompts(promptService.getAll());
    setCollections(promptService.getCollections());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const createPrompt = useCallback(
    (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'currentVersion' | 'versions'>) => {
      const prompt = promptService.create(data);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const updatePrompt = useCallback(
    (id: string, data: Partial<Prompt>) => {
      const prompt = promptService.update(id, data);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const createVersion = useCallback(
    (id: string, data: Partial<Prompt>, changesSummary?: string) => {
      const prompt = promptService.createVersion(id, data, changesSummary);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const restoreVersion = useCallback(
    (id: string, versionNumber: number) => {
      const prompt = promptService.restoreVersion(id, versionNumber);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const deletePrompt = useCallback(
    (id: string) => {
      const result = promptService.delete(id);
      refresh();
      return result;
    },
    [refresh],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const prompt = promptService.toggleFavorite(id);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const incrementUsage = useCallback(
    (id: string) => {
      promptService.incrementUsage(id);
      refresh();
    },
    [refresh],
  );

  const duplicatePrompt = useCallback(
    (id: string) => {
      const prompt = promptService.duplicate(id);
      refresh();
      return prompt;
    },
    [refresh],
  );

  const searchPrompts = useCallback(
    (query: string, filters?: FilterOptions) => {
      return promptService.search(query, filters);
    },
    [],
  );

  const getStats = useCallback(() => {
    return promptService.getStats();
  }, []);

  const createCollection = useCallback(
    (name: string, description?: string, color?: string) => {
      const col = promptService.createCollection(name, description, color);
      refresh();
      return col;
    },
    [refresh],
  );

  const updateCollection = useCallback(
    (id: string, data: Partial<Collection>) => {
      const col = promptService.updateCollection(id, data);
      refresh();
      return col;
    },
    [refresh],
  );

  const deleteCollection = useCallback(
    (id: string) => {
      const result = promptService.deleteCollection(id);
      refresh();
      return result;
    },
    [refresh],
  );

  const togglePromptInCollection = useCallback(
    (collectionId: string, promptId: string) => {
      const result = promptService.togglePromptInCollection(collectionId, promptId);
      refresh();
      return result;
    },
    [refresh],
  );

  return (
    <PromptContext
      value={{
        prompts,
        collections,
        loading,
        refresh,
        createPrompt,
        updatePrompt,
        createVersion,
        restoreVersion,
        deletePrompt,
        toggleFavorite,
        incrementUsage,
        duplicatePrompt,
        searchPrompts,
        getStats,
        createCollection,
        updateCollection,
        deleteCollection,
        togglePromptInCollection,
      }}
    >
      {children}
    </PromptContext>
  );
}

export function usePrompts() {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error('usePrompts must be used within PromptProvider');
  return ctx;
}
