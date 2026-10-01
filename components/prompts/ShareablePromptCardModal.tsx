'use client';

import { useState, useRef } from 'react';
import type { Prompt } from '@/types/prompt';
import { getCategoryMeta } from '@/lib/constants';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface ShareablePromptCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt;
}

const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 text-white',
    accent: '#38BDF8',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Blue',
    bg: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 text-white',
    accent: '#818CF8',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    bg: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-950 text-white',
    accent: '#34D399',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
  },
  {
    id: 'sunset',
    name: 'Sunset Rose',
    bg: 'bg-gradient-to-br from-purple-950 via-rose-900 to-slate-950 text-white',
    accent: '#FB7185',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
  },
];

export function ShareablePromptCardModal({
  isOpen,
  onClose,
  prompt,
}: ShareablePromptCardModalProps) {
  const { addToast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const category = getCategoryMeta(prompt.category);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      addToast('Prompt copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const width = 1200;
      const height = 675; // 16:9 social share ratio
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        addToast('Canvas rendering unsupported', 'error');
        setDownloading(false);
        return;
      }

      // Draw Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (selectedTheme.id === 'cosmic') {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#312e81');
        gradient.addColorStop(1, '#020617');
      } else if (selectedTheme.id === 'emerald') {
        gradient.addColorStop(0, '#042f2e');
        gradient.addColorStop(0.5, '#064e3b');
        gradient.addColorStop(1, '#020617');
      } else if (selectedTheme.id === 'sunset') {
        gradient.addColorStop(0, '#3b0764');
        gradient.addColorStop(0.5, '#881337');
        gradient.addColorStop(1, '#020617');
      } else {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#09090b');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Card Container (Glass effect)
      const pad = 60;
      const cardX = pad;
      const cardY = pad;
      const cardW = width - pad * 2;
      const cardH = height - pad * 2;

      ctx.fillStyle = selectedTheme.cardBg;
      ctx.strokeStyle = selectedTheme.cardBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 24);
      ctx.fill();
      ctx.stroke();

      // Category Pill
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillStyle = selectedTheme.accent;
      ctx.fillText(category.name.toUpperCase(), cardX + 50, cardY + 70);

      // Title
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      const title = prompt.title.length > 55 ? prompt.title.slice(0, 52) + '...' : prompt.title;
      ctx.fillText(title, cardX + 50, cardY + 130);

      // Content Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(cardX + 50, cardY + 160, cardW - 100, 310, 16);
      ctx.fill();

      // Content Lines (Wrap Text)
      ctx.font = '22px Inter, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      const maxCharsPerLine = 68;
      const lines: string[] = [];
      const words = (prompt.content || '').split(' ');
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
          currentLine = (currentLine + ' ' + word).trim();
        } else {
          lines.push(currentLine);
          currentLine = word;
          if (lines.length >= 7) break;
        }
      }
      if (currentLine && lines.length < 7) {
        lines.push(currentLine);
      }
      if (lines.length >= 7) {
        lines[6] = lines[6].slice(0, 60) + '...';
      }

      let yPos = cardY + 215;
      for (const line of lines) {
        ctx.fillText(line, cardX + 80, yPos);
        yPos += 36;
      }

      // Footer branding
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('✨ PromptVault • AI Prompt Library', cardX + 50, cardY + cardH - 35);

      if (prompt.tool) {
        ctx.textAlign = 'right';
        ctx.fillText(`Target: ${prompt.tool}`, cardX + cardW - 50, cardY + cardH - 35);
        ctx.textAlign = 'left';
      }

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `promptvault-${prompt.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      a.click();
      addToast('Card image generated and downloaded!', 'success');
    } catch {
      addToast('Failed to generate image', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] max-w-2xl w-full max-h-[92vh] flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Shareable Prompt Card
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Export an eye-catching card ready for social sharing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="px-6 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border-subtle)] flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-secondary)] font-medium">Style Theme:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={cn(
                  'px-3 py-1 text-xs rounded-[var(--radius-md)] border font-medium transition-all cursor-pointer',
                  selectedTheme.id === theme.id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                )}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Card Preview */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-[var(--color-bg)]">
          <div
            ref={cardRef}
            className={cn(
              'w-full rounded-2xl p-6 shadow-2xl transition-all duration-300 relative border border-white/10',
              selectedTheme.bg,
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10"
                style={{ color: selectedTheme.accent }}
              >
                {category.name}
              </span>
              <span className="text-[11px] text-white/50 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-white/70" /> PromptVault
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
              {prompt.title}
            </h3>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-hidden line-clamp-6">
              {prompt.content}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
              <span>{prompt.tool ? `Target: ${prompt.tool}` : 'AI Prompt Library'}</span>
              <span>v{prompt.currentVersion || 1}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopyText}
          >
            {copied ? 'Copied Text' : 'Copy Text'}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownloadImage}
              loading={downloading}
            >
              Download Card (PNG)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
