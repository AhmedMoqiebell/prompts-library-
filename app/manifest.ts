import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PromptVault | مكتبة برومبتات الذكاء الاصطناعي',
    short_name: 'PromptVault',
    description: 'المنصة الاحترافية لحفظ وتنظيم وتحسين برومبتات الذكاء الاصطناعي وإدارتها بكفاءة عالية',
    start_url: '/',
    display: 'standalone',
    background_color: '#080402',
    theme_color: '#db5f29',
    orientation: 'portrait-primary',
    scope: '/',
    dir: 'auto',
    lang: 'ar',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    categories: ['productivity', 'utilities', 'developer'],
  };
}
