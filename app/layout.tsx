import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { PromptProvider } from '@/contexts/PromptContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'PromptVault — AI Prompt Library',
  description: 'A premium prompt management platform to save, organize, classify, and manage your AI prompts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <PromptProvider>
            <AppShell>{children}</AppShell>
            <ToastContainer />
          </PromptProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
