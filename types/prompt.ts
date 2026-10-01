export type CategorySlug =
  | 'programming'
  | 'writing'
  | 'image-generation'
  | 'video-generation'
  | 'ui-ux-design'
  | 'research-analysis'
  | 'general';

export interface PromptVersion {
  id: string;
  versionNumber: number; // e.g. 1 -> v1, 2 -> v2
  versionLabel: string; // e.g. 'v1', 'v2'
  content: string;
  title: string;
  description: string;
  category: CategorySlug;
  subcategory: string;
  tool: string;
  technologies: string[];
  tags: string[];
  changes?: string; // Change summary / commit log
  createdAt: string;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  content: string;
  description: string;
  category: CategorySlug;
  subcategory: string;
  tool: string;
  technologies: string[];
  tags: string[];
  favorite: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  currentVersion?: number;
  versions?: PromptVersion[];
}

export interface ClassificationResult {
  title: string;
  category: CategorySlug;
  subcategory: string;
  tool: string;
  technologies: string[];
  tags: string[];
  purpose: string;
  description: string;
}

export interface PromptFormData {
  title: string;
  content: string;
  description: string;
  category: CategorySlug;
  subcategory: string;
  tool: string;
  technologies: string[];
  tags: string[];
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'recently-updated'
  | 'most-used'
  | 'alphabetical';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string; // hex or tailwind color class
  icon?: string;
  promptIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  category?: CategorySlug;
  subcategory?: string;
  tool?: string;
  tags?: string[];
  favorite?: boolean;
  collectionId?: string;
  search?: string;
  sort?: SortOption;
}

// ─── Quality Analysis Types (Actionable Findings, No arbitrary scores) ───

export type QualityDimensionType =
  | 'role-definition'
  | 'structure'
  | 'clarity'
  | 'missing-context'
  | 'ambiguous-instructions'
  | 'output-requirements'
  | 'constraints'
  | 'expected-format';

export interface QualityFinding {
  dimension: QualityDimensionType;
  title: string;
  detail: string;
  snippet?: string;
  suggestedAction?: string;
  insertableTemplate?: string;
}

export interface PromptQualityAnalysis {
  detected: QualityFinding[];
  missing: QualityFinding[];
  warnings: QualityFinding[];
  suggestions: QualityFinding[];
  analyzedAt: string;
}

// ─── Intelligent Organization Types ───

export interface DuplicateDetectionResult {
  isExactDuplicate: boolean;
  matchedPrompt?: {
    id: string;
    title: string;
    category: CategorySlug;
    content: string;
  };
}

export interface SimilarPromptMatch {
  prompt: Prompt;
  similarityScore: number; // 0.0 - 1.0 (percentage)
  matchReasons: string[];
}

export interface TagSuggestion {
  tag: string;
  reason: string;
  source: 'technology' | 'domain' | 'intent' | 'format';
}

export interface CategoryCorrectionSuggestion {
  currentCategory: CategorySlug;
  suggestedCategory: CategorySlug;
  confidence: number; // 0.0 - 1.0
  reason: string;
  isDifferent: boolean;
}

export interface TitleSuggestion {
  title: string;
  type: 'action' | 'persona' | 'concise';
}
