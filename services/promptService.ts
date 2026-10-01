import type { Prompt, PromptVersion, FilterOptions, CategorySlug, Collection } from '@/types/prompt';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'promptvault_prompts';
const COLLECTIONS_STORAGE_KEY = 'promptvault_collections';

function normalizePrompt(p: Prompt): Prompt {
  if (!p.versions || p.versions.length === 0) {
    const v1: PromptVersion = {
      id: generateId(),
      versionNumber: 1,
      versionLabel: 'v1',
      content: p.content,
      title: p.title,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      tool: p.tool,
      technologies: p.technologies || [],
      tags: p.tags || [],
      changes: 'Initial version',
      createdAt: p.createdAt || new Date().toISOString(),
    };
    return {
      ...p,
      currentVersion: 1,
      versions: [v1],
    };
  }
  return p;
}

function getPrompts(): Prompt[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaultPrompts: Prompt[] = [
        {
          id: 'prompt-starter-code-review',
          userId: 'local-user',
          title: 'Full-Stack Code Review & Security Audit',
          description: 'Comprehensive code review prompt analyzing security, performance, clean architecture, and edge cases.',
          category: 'programming',
          subcategory: 'Code Review',
          tool: 'ChatGPT / Claude',
          technologies: ['TypeScript', 'Node.js', 'React'],
          tags: ['security', 'architecture', 'best-practices', 'template'],
          favorite: true,
          usageCount: 14,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: `You are an elite Senior Principal Software Architect and Security Auditor specializing in {{framework:Next.js}} and {{backend:Node.js}}.

Review the provided code snippet with meticulous attention to:
1. Critical Vulnerabilities (Injection, CSRF, broken access control)
2. Performance bottlenecks and unnecessary re-renders
3. Modern idiomatic patterns and type safety
4. Priority focus area: {{focus_area:Security & Scalability}}

Provide output structured with:
- Executive Summary & Risk Level (Low/Medium/High)
- Concrete Issues found with code diff fixes
- Recommended architectural improvements`,
        },
        {
          id: 'prompt-starter-arabic-seo',
          userId: 'local-user',
          title: 'مساعد كتابة مقالات احترافية متوافقة مع معايير SEO',
          description: 'برومبت متخصص في صياغة مقالات متكاملة ومتوافقة مع محركات البحث باللغة العربية باحترافية عالية.',
          category: 'writing',
          subcategory: 'Content & SEO',
          tool: 'Claude 3.5 / ChatGPT',
          technologies: ['SEO', 'Copywriting'],
          tags: ['عربي', 'seo', 'مقالات', 'محتوى'],
          favorite: true,
          usageCount: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: `بصفتك خبير استراتيجي في تحسين محركات البحث (SEO) وكاتب محتوى متميز باللغة العربية:

المطلوب:
كتابة مقال شامل، جذاب، واحترافي حول موضوع: {{topic:أحدث اتجاهات الذكاء الاصطناعي في 2026}}
الجمهور المستهدف: {{target_audience:المطورين ورواد الأعمال}}
الطول المستهدف: {{target_words:1000}} كلمة تقريباً.

إرشادات الصياغة:
1. صياغة عنوان جذاب مع تضمين الكلمة المفتاحية الرئيسية.
2. مقدمة تشد القارئ وتوضح الفائدة المباشرة.
3. عناوين فرعية (H2 و H3) مقسمة بشكل منطقي وسهل القراءة.
4. نقاط عملية وحلول قابلة للتطبيق الفعلي مع تجنب الحشو والعبارات الإنشائية.
5. خاتمة تلخص أهم النتائج مع دعوة لاتخاذ إجراء (Call to Action).`,
        },
        {
          id: 'prompt-starter-saas-copy',
          userId: 'local-user',
          title: 'High-Converting SaaS Landing Page Hero Copy',
          description: 'Framework to produce high-converting hero headlines, subheads, and CTA microcopy.',
          category: 'ui-ux-design',
          subcategory: 'Conversion Copy',
          tool: 'Claude / Gemini',
          technologies: ['Marketing', 'Conversion Rate Optimization'],
          tags: ['saas', 'copywriting', 'conversion', 'landing-page'],
          favorite: false,
          usageCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: `Act as a world-class Conversion Rate Optimization (CRO) copywriter.

We are launching {{product_name:PromptVault}} which solves {{core_problem:scattered and forgotten AI prompts for creators}}.

Generate 3 high-converting Hero Section variations:
- Variation 1: Direct & Outcome-driven
- Variation 2: Pain-point & Relief
- Variation 3: Social Proof & Status

For each variation, include:
1. Primary Headline (under 9 words)
2. Compelling Subheadline (2 sentences max)
3. Primary Call-to-Action button text
4. Microcopy beneath CTA addressing friction`,
        },
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPrompts));
      return defaultPrompts.map(normalizePrompt);
    }
    const list: Prompt[] = JSON.parse(data);
    return list.map(normalizePrompt);
  } catch {
    return [];
  }
}

function savePrompts(prompts: Prompt[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

function getCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!data) {
      // Seed default collections if none exist
      const defaultCollections: Collection[] = [
        {
          id: 'col-getting-started',
          name: 'Essential Starters',
          description: 'High-leverage foundation prompts for daily work',
          color: '#3B82F6',
          icon: 'Sparkles',
          promptIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(defaultCollections));
      return defaultCollections;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
}

export const promptService = {
  getAll(): Prompt[] {
    return getPrompts();
  },

  getById(id: string): Prompt | null {
    return getPrompts().find((p) => p.id === id) ?? null;
  },

  create(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'currentVersion' | 'versions'>): Prompt {
    const prompts = getPrompts();
    const now = new Date().toISOString();
    const promptId = generateId();

    const v1: PromptVersion = {
      id: generateId(),
      versionNumber: 1,
      versionLabel: 'v1',
      content: data.content,
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      tool: data.tool,
      technologies: data.technologies || [],
      tags: data.tags || [],
      changes: 'Initial creation (v1)',
      createdAt: now,
    };

    const newPrompt: Prompt = {
      ...data,
      id: promptId,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      currentVersion: 1,
      versions: [v1],
    };

    prompts.unshift(newPrompt);
    savePrompts(prompts);
    return newPrompt;
  },

  update(id: string, data: Partial<Prompt>): Prompt | null {
    const prompts = getPrompts();
    const index = prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = prompts[index];
    const updated = {
      ...current,
      ...data,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    prompts[index] = updated;
    savePrompts(prompts);
    return updated;
  },

  createVersion(id: string, data: Partial<Prompt>, changesSummary?: string): Prompt | null {
    const prompts = getPrompts();
    const index = prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const target = normalizePrompt(prompts[index]);
    const versions = target.versions ? [...target.versions] : [];
    const maxVerNum = versions.reduce((max, v) => Math.max(max, v.versionNumber), 0);
    const nextVerNum = maxVerNum + 1;
    const now = new Date().toISOString();

    const newContent = data.content !== undefined ? data.content : target.content;
    const newTitle = data.title !== undefined ? data.title : target.title;
    const newDesc = data.description !== undefined ? data.description : target.description;
    const newCat = data.category !== undefined ? data.category : target.category;
    const newSubcat = data.subcategory !== undefined ? data.subcategory : target.subcategory;
    const newTool = data.tool !== undefined ? data.tool : target.tool;
    const newTechs = data.technologies !== undefined ? data.technologies : target.technologies;
    const newTags = data.tags !== undefined ? data.tags : target.tags;

    const newVersion: PromptVersion = {
      id: generateId(),
      versionNumber: nextVerNum,
      versionLabel: `v${nextVerNum}`,
      content: newContent,
      title: newTitle,
      description: newDesc,
      category: newCat,
      subcategory: newSubcat,
      tool: newTool,
      technologies: newTechs,
      tags: newTags,
      changes: changesSummary?.trim() || `Updated to version v${nextVerNum}`,
      createdAt: now,
    };

    versions.push(newVersion);

    const updatedPrompt: Prompt = {
      ...target,
      ...data,
      content: newContent,
      title: newTitle,
      description: newDesc,
      category: newCat,
      subcategory: newSubcat,
      tool: newTool,
      technologies: newTechs,
      tags: newTags,
      currentVersion: nextVerNum,
      versions,
      updatedAt: now,
    };

    prompts[index] = updatedPrompt;
    savePrompts(prompts);
    return updatedPrompt;
  },

  restoreVersion(promptId: string, versionNumber: number): Prompt | null {
    const prompts = getPrompts();
    const index = prompts.findIndex((p) => p.id === promptId);
    if (index === -1) return null;

    const target = normalizePrompt(prompts[index]);
    const targetVer = target.versions?.find((v) => v.versionNumber === versionNumber);
    if (!targetVer) return null;

    const now = new Date().toISOString();
    const updatedPrompt: Prompt = {
      ...target,
      content: targetVer.content,
      title: targetVer.title,
      description: targetVer.description,
      category: targetVer.category,
      subcategory: targetVer.subcategory,
      tool: targetVer.tool,
      technologies: [...targetVer.technologies],
      tags: [...targetVer.tags],
      currentVersion: targetVer.versionNumber,
      updatedAt: now,
    };

    prompts[index] = updatedPrompt;
    savePrompts(prompts);
    return updatedPrompt;
  },

  delete(id: string): boolean {
    const prompts = getPrompts();
    const filtered = prompts.filter((p) => p.id !== id);
    if (filtered.length === prompts.length) return false;
    savePrompts(filtered);
    return true;
  },

  toggleFavorite(id: string): Prompt | null {
    const prompts = getPrompts();
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return null;
    prompt.favorite = !prompt.favorite;
    prompt.updatedAt = new Date().toISOString();
    savePrompts(prompts);
    return prompt;
  },

  incrementUsage(id: string): void {
    const prompts = getPrompts();
    const prompt = prompts.find((p) => p.id === id);
    if (prompt) {
      prompt.usageCount += 1;
      savePrompts(prompts);
    }
  },

  duplicate(id: string): Prompt | null {
    const original = this.getById(id);
    if (!original) return null;

    return this.create({
      ...original,
      title: `${original.title} (Copy)`,
      favorite: false,
      userId: original.userId,
    });
  },

  search(query: string, filters?: FilterOptions): Prompt[] {
    let prompts = getPrompts();
    const q = query.toLowerCase().trim();

    if (q) {
      prompts = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tool.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filters) {
      if (filters.category) {
        prompts = prompts.filter((p) => p.category === filters.category);
      }
      if (filters.favorite !== undefined) {
        prompts = prompts.filter((p) => p.favorite === filters.favorite);
      }
      if (filters.tool) {
        prompts = prompts.filter((p) =>
          p.tool.toLowerCase().includes(filters.tool!.toLowerCase()),
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        prompts = prompts.filter((p) =>
          filters.tags!.some((t) => p.tags.includes(t)),
        );
      }
      if (filters.collectionId) {
        const collections = getCollections();
        const targetCol = collections.find((c) => c.id === filters.collectionId);
        if (targetCol) {
          const ids = new Set(targetCol.promptIds);
          prompts = prompts.filter((p) => ids.has(p.id));
        } else {
          prompts = [];
        }
      }
    }

    // Sort
    const sort = filters?.sort ?? 'newest';
    switch (sort) {
      case 'newest':
        prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        prompts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'recently-updated':
        prompts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'most-used':
        prompts.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'alphabetical':
        prompts.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return prompts;
  },

  getByCategory(slug: CategorySlug): Prompt[] {
    return getPrompts().filter((p) => p.category === slug);
  },

  getFavorites(): Prompt[] {
    return getPrompts().filter((p) => p.favorite);
  },

  getAllTags(): { name: string; count: number }[] {
    const tagMap = new Map<string, number>();
    for (const prompt of getPrompts()) {
      for (const tag of prompt.tags) {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },

  getStats() {
    const prompts = getPrompts();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const categoryCount: Record<string, number> = {};
    for (const p of prompts) {
      categoryCount[p.category] = (categoryCount[p.category] ?? 0) + 1;
    }

    const topCategory = Object.entries(categoryCount).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return {
      total: prompts.length,
      favorites: prompts.filter((p) => p.favorite).length,
      thisMonth: prompts.filter(
        (p) => new Date(p.createdAt) >= monthStart,
      ).length,
      topCategory: topCategory ? topCategory[0] : null,
      categoryDistribution: categoryCount,
    };
  },

  exportAll(): string {
    return JSON.stringify(getPrompts(), null, 2);
  },

  exportAsMarkdown(): string {
    const prompts = getPrompts();
    const date = new Date().toISOString().split('T')[0];
    let md = `# PromptVault Library Export\n*Exported on ${date} • Total Prompts: ${prompts.length}*\n\n---\n\n`;

    for (const p of prompts) {
      md += `## ${p.title}\n`;
      md += `- **Category:** ${p.category} ${p.subcategory ? `> ${p.subcategory}` : ''}\n`;
      if (p.tool) md += `- **Target Tool:** ${p.tool}\n`;
      if (p.tags && p.tags.length > 0) md += `- **Tags:** ${p.tags.join(', ')}\n`;
      if (p.description) md += `- **Description:** ${p.description}\n`;
      md += `\n\`\`\`text\n${p.content}\n\`\`\`\n\n---\n\n`;
    }

    return md;
  },

  exportAsCsv(): string {
    const prompts = getPrompts();
    const headers = ['ID', 'Title', 'Category', 'Subcategory', 'Tool', 'Tags', 'Favorite', 'UsageCount', 'Description', 'Content'];
    const rows = prompts.map((p) => [
      `"${p.id}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.subcategory || '').replace(/"/g, '""')}"`,
      `"${(p.tool || '').replace(/"/g, '""')}"`,
      `"${(p.tags || []).join('; ')}"`,
      `"${p.favorite ? 'true' : 'false'}"`,
      `"${p.usageCount}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${(p.content || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  // ─── Collections Management ───
  getCollections(): Collection[] {
    return getCollections();
  },

  createCollection(name: string, description?: string, color: string = '#3B82F6'): Collection {
    const collections = getCollections();
    const now = new Date().toISOString();
    const newCol: Collection = {
      id: generateId(),
      name,
      description,
      color,
      promptIds: [],
      createdAt: now,
      updatedAt: now,
    };
    collections.push(newCol);
    saveCollections(collections);
    return newCol;
  },

  updateCollection(id: string, data: Partial<Collection>): Collection | null {
    const collections = getCollections();
    const idx = collections.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated: Collection = {
      ...collections[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    collections[idx] = updated;
    saveCollections(collections);
    return updated;
  },

  deleteCollection(id: string): boolean {
    const collections = getCollections();
    const filtered = collections.filter((c) => c.id !== id);
    if (filtered.length === collections.length) return false;
    saveCollections(filtered);
    return true;
  },

  togglePromptInCollection(collectionId: string, promptId: string): boolean {
    const collections = getCollections();
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return false;

    const exists = col.promptIds.includes(promptId);
    if (exists) {
      col.promptIds = col.promptIds.filter((id) => id !== promptId);
    } else {
      col.promptIds.push(promptId);
    }
    col.updatedAt = new Date().toISOString();
    saveCollections(collections);
    return !exists;
  },

  importFromJson(json: string): { imported: number; errors: number } {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) throw new Error('Invalid format');

      const existing = getPrompts();
      const existingIds = new Set(existing.map((p) => p.id));
      let imported = 0;
      let errors = 0;

      for (const item of data) {
        if (
          typeof item.title === 'string' &&
          typeof item.content === 'string' &&
          typeof item.category === 'string'
        ) {
          if (!existingIds.has(item.id)) {
            const normalized = normalizePrompt({
              ...item,
              id: item.id || generateId(),
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
            });
            existing.push(normalized);
            imported++;
          }
        } else {
          errors++;
        }
      }

      savePrompts(existing);
      return { imported, errors };
    } catch {
      return { imported: 0, errors: 1 };
    }
  },

  clearAll(): void {
    savePrompts([]);
  },
};
