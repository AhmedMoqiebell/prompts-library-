import type { MetadataRoute } from 'next';
import type { CategorySlug } from '@/types/prompt';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptvault.app';

const CATEGORIES: CategorySlug[] = [
  'programming',
  'writing',
  'image-generation',
  'video-generation',
  'ui-ux-design',
  'research-analysis',
  'general',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${BASE_URL}/?lang=ar`,
          en: `${BASE_URL}/?lang=en`,
        },
      },
    },
    {
      url: `${BASE_URL}/prompts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/favorites`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        ar: `${BASE_URL}/category/${slug}?lang=ar`,
        en: `${BASE_URL}/category/${slug}?lang=en`,
      },
    },
  }));

  return [...staticPages, ...categoryPages];
}
