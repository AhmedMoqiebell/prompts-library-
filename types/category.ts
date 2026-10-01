import type { CategorySlug } from './prompt';

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}
