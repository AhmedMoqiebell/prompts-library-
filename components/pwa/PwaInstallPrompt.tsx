'use client';

import React from 'react';
import Image from 'next/image';
import { usePwa } from '@/contexts/PwaContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, X, Share2, PlusSquare, Sparkles, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PwaInstallPrompt() {
  const { isInstallable, bannerDismissed, dismissBanner, promptInstall, showIosGuide, setShowIosGuide, isInstalled } = usePwa();
  const { t, language } = useLanguage();

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Bottom Install Banner */}
      {isInstallable && !bannerDismissed && (
        <div
          role="dialog"
          aria-label={t('installPromptTitle')}
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 start-3 end-3 sm:start-auto sm:end-6 sm:max-w-md z-50 p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-[var(--shadow-xl)] animate-slide-up transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-gradient-to-br from-[#db5f29] to-[#8edbec] p-0.5 flex-shrink-0 shadow-sm">
              <div className="w-full h-full rounded-[var(--radius-lg)] bg-[#080402] flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6 text-[#db5f29]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[var(--color-text)] truncate">
                  {t('installPromptTitle')}
                </h4>
                <button
                  onClick={dismissBanner}
                  className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors p-1 -m-1 rounded-md"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                {t('installPromptDesc')}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => promptInstall()}
                  icon={<Download className="w-3.5 h-3.5" />}
                  className="flex-1 text-xs py-1.5"
                >
                  {t('installNow')}
                </Button>
                <button
                  onClick={dismissBanner}
                  className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                >
                  {t('dismiss')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Guidance Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm rounded-[var(--radius-2xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-2xl)] p-6 space-y-4 animate-scale-in"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[var(--color-accent)]" />
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  {language === 'ar' ? 'تثبيت التطبيق على جهازك' : 'Install on Your Device'}
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {language === 'ar'
                ? 'يمكنك تثبيت PromptVault مباشرة ليعمل كتطبيق مستقل بدون الحاجة لمتجر التطبيقات:'
                : 'You can install PromptVault directly to run as a standalone app without an app store:'}
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[var(--color-text)] block mb-0.5">
                    {language === 'ar' ? 'اضغط على زر المشاركة' : 'Tap the Share Button'}
                  </span>
                  <span className="text-[var(--color-text-secondary)] inline-flex items-center gap-1">
                    {language === 'ar' ? (
                      <>في أسفل متصفح Safari، اضغط على أيقونة المشاركة <Share2 className="w-3.5 h-3.5 text-[var(--color-accent)] inline" /></>
                    ) : (
                      <>At the bottom of Safari, tap the Share icon <Share2 className="w-3.5 h-3.5 text-[var(--color-accent)] inline" /></>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[var(--color-text)] block mb-0.5">
                    {language === 'ar' ? 'اختر إضافة إلى الصفحة الرئيسية' : 'Choose Add to Home Screen'}
                  </span>
                  <span className="text-[var(--color-text-secondary)] inline-flex items-center gap-1">
                    {language === 'ar' ? (
                      <>مرر لأسفل ثم اضغط على <PlusSquare className="w-3.5 h-3.5 text-[var(--color-accent)] inline" /> &quot;إضافة إلى الشاشة الرئيسية&quot;</>
                    ) : (
                      <>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-[var(--color-accent)] inline" /> &quot;Add to Home Screen&quot;</>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[var(--color-text)] block mb-0.5">
                    {language === 'ar' ? 'تأكيد الإضافة' : 'Confirm & Enjoy'}
                  </span>
                  <span className="text-[var(--color-text-secondary)] inline-flex items-center gap-1">
                    {language === 'ar' ? (
                      <>اضغط على &quot;إضافة&quot; (Add) في الزاوية العلوية <Check className="w-3.5 h-3.5 text-emerald-500 inline" /></>
                    ) : (
                      <>Tap &quot;Add&quot; in top right <Check className="w-3.5 h-3.5 text-emerald-500 inline" /></>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full text-xs"
              variant="secondary"
              onClick={() => setShowIosGuide(false)}
            >
              {language === 'ar' ? 'فهمت ذلك' : 'Got it'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function HeaderInstallButton() {
  const { isInstallable, promptInstall, isInstalled } = usePwa();
  const { t } = useLanguage();

  if (isInstalled || !isInstallable) return null;

  return (
    <button
      onClick={() => promptInstall()}
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-accent-light)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all text-xs font-semibold cursor-pointer border border-[var(--color-accent)]/20"
      title={t('installApp')}
      aria-label={t('installApp')}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{t('installApp')}</span>
    </button>
  );
}
