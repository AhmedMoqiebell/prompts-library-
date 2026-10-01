'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import { usePrompts } from '@/contexts/PromptContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AIPlatformLauncherProps {
  promptId: string;
  getContent: () => string;
  className?: string;
  variant?: 'buttons' | 'dropdown';
}

const AI_PLATFORMS = [
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    color: 'hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-600',
    iconColor: 'bg-emerald-600',
    badge: 'OpenAI',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/new',
    color: 'hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600',
    iconColor: 'bg-amber-600',
    badge: 'Anthropic',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    color: 'hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-600',
    iconColor: 'bg-blue-600',
    badge: 'Google',
  },
];

export function AIPlatformLauncher({
  promptId,
  getContent,
  className,
  variant = 'buttons',
}: AIPlatformLauncherProps) {
  const { addToast } = useToast();
  const { incrementUsage } = usePrompts();
  const [open, setOpen] = useState(false);

  const handleLaunch = async (platform: typeof AI_PLATFORMS[0]) => {
    const text = getContent();
    if (!text) return;

    await copyToClipboard(text);
    incrementUsage(promptId);
    addToast(`Prompt copied! Opening ${platform.name}...`, 'success');
    window.open(platform.url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative inline-block', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
          icon={<ExternalLink className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Open in AI
        </Button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute end-0 top-full mt-1.5 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] py-1.5 z-40 animate-scale-in">
              <div className="px-3 py-1 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Copy & Open in:
              </div>
              {AI_PLATFORMS.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleLaunch(platform)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                >
                  <span className="font-medium">{platform.name}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)]">
                    {platform.badge}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      <span className="text-xs text-[var(--color-text-tertiary)] me-1 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Run in:
      </span>
      {AI_PLATFORMS.map((platform) => (
        <button
          key={platform.name}
          onClick={() => handleLaunch(platform)}
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-[var(--radius-md)]',
            'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
            'transition-all duration-150 cursor-pointer shadow-xs',
            platform.color,
          )}
          title={`Copy prompt and launch ${platform.name}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {platform.name}
          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
        </button>
      ))}
    </div>
  );
}
