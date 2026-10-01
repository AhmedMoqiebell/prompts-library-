import type { CategoryMeta } from '@/types/category';
import type { CategorySlug, SortOption } from '@/types/prompt';

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'programming',
    name: 'Programming',
    description: 'Code generation, debugging, and software development prompts',
    icon: 'Code2',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  {
    slug: 'writing',
    name: 'Writing',
    description: 'Content creation, copywriting, and creative writing prompts',
    icon: 'PenLine',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  {
    slug: 'image-generation',
    name: 'Image Generation',
    description: 'AI image creation and visual design prompts',
    icon: 'ImageIcon',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  {
    slug: 'video-generation',
    name: 'Video Generation',
    description: 'AI video creation and editing prompts',
    icon: 'Video',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX & Design',
    description: 'User interface, user experience, and design system prompts',
    icon: 'Palette',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  {
    slug: 'research-analysis',
    name: 'Research & Analysis',
    description: 'Data analysis, research, and strategic planning prompts',
    icon: 'BarChart3',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  {
    slug: 'general',
    name: 'General / Other',
    description: 'General purpose and miscellaneous prompts',
    icon: 'Layers',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
  },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'recently-updated', label: 'Recently Updated' },
  { value: 'most-used', label: 'Most Used' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export const PROMPTS_PER_PAGE = 20;

export function getCategoryMeta(slug: CategorySlug): CategoryMeta {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[CATEGORIES.length - 1];
}
