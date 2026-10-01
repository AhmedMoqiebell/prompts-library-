import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { PromptProvider } from '@/contexts/PromptContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PwaProvider } from '@/contexts/PwaContext';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { ToastContainer } from '@/components/ui/Toast';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptvault.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#080402' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PromptVault | مكتبة وهندسة برومبتات الذكاء الاصطناعي',
    template: '%s | PromptVault',
  },
  description:
    'المنصة الاحترافية الأولى لتنظيم، إدارة، وهندسة برومبتات الذكاء الاصطناعي (ChatGPT, Midjourney, Claude, Gemini). حفظ البرومبتات، تجربة المتغيرات، وفحص الجودة تلقائيًا.',
  applicationName: 'PromptVault',
  authors: [{ name: 'PromptVault Team', url: BASE_URL }],
  generator: 'Next.js',
  keywords: [
    'برومبتات',
    'ذكاء اصطناعي',
    'هندسة الأوامر',
    'ChatGPT prompts',
    'Midjourney prompts',
    'Claude prompts',
    'Gemini prompts',
    'prompt engineering',
    'prompt library',
    'مكتبة البرومبت',
    'أوامر الذكاء الاصطناعي',
    'PromptVault',
    'AI prompts management',
  ],
  creator: 'PromptVault',
  publisher: 'PromptVault',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: BASE_URL,
    languages: {
      ar: `${BASE_URL}/?lang=ar`,
      en: `${BASE_URL}/?lang=en`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'PromptVault',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: BASE_URL,
    title: 'PromptVault — مكتبة وهندسة برومبتات الذكاء الاصطناعي',
    description:
      'المنصة المتكاملة لإدارة وتنظيم برومبتات الذكاء الاصطناعي، اختبار المتغيرات، وفحص الجودة بكفاءة عالية.',
    siteName: 'PromptVault',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'PromptVault App Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptVault — مكتبة وهندسة برومبتات الذكاء الاصطناعي',
    description:
      'المنصة المتكاملة لحفظ وتصنيف واختبار برومبتات الذكاء الاصطناعي بدقة وكفاءة.',
    images: ['/icons/icon-512.png'],
    creator: '@promptvault',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PromptVault',
  alternateName: 'مكتبة برومبتات الذكاء الاصطناعي PromptVault',
  url: BASE_URL,
  description:
    'المنصة الاحترافية لإدارة وهندسة برومبتات الذكاء الاصطناعي للمطورين والمبدعين والباحثين.',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires modern web browser with JavaScript enabled.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'مكتبة تصنيف برومبتات ذكية',
    'محرر تفاعلي لملء المتغيرات الفورية',
    'تحسين البرومبتات بالذكاء الاصطناعي وفحص جودتها',
    'إمكانية التثبيت والعمل أوفلاين كتطبيق مستقل (PWA)',
    'دعم كامل للغتين العربية والإنجليزية مع الوضع الداكن',
  ],
  inLanguage: ['ar', 'en'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Anti-Flicker Script for Theme & Language */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('promptvault_theme');
                  var isDark = savedTheme === 'dark' || ((!savedTheme || savedTheme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                  var savedLang = localStorage.getItem('promptvault_lang') || 'ar';
                  document.documentElement.lang = savedLang;
                  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <PwaRegister />
        <ThemeProvider>
          <LanguageProvider>
            <PwaProvider>
              <ToastProvider>
                <PromptProvider>
                  <AppShell>{children}</AppShell>
                  <PwaInstallPrompt />
                  <ToastContainer />
                </PromptProvider>
              </ToastProvider>
            </PwaProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
