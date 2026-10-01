'use client';

import { useState, useRef } from 'react';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { promptService } from '@/services/promptService';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Download, Upload, Trash2, Moon, Sun, Monitor, Languages, Check, Smartphone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePwa } from '@/contexts/PwaContext';

type Tab = 'profile' | 'preferences' | 'appearance' | 'data';

export default function SettingsPage() {
  const { prompts, refresh } = usePrompts();
  const { addToast } = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isInstalled, isInstallable, promptInstall } = usePwa();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: t('profile') },
    { id: 'preferences', label: t('preferences') },
    { id: 'appearance', label: t('appearance') },
    { id: 'data', label: t('dataManagement') },
  ];

  const handleExportJson = () => {
    const data = promptService.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptvault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${prompts.length} prompts as JSON`, 'success');
  };

  const handleExportMarkdown = () => {
    const data = promptService.exportAsMarkdown();
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptvault-export-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${prompts.length} prompts as Markdown`, 'success');
  };

  const handleExportCsv = () => {
    const data = promptService.exportAsCsv();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptvault-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${prompts.length} prompts as CSV`, 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = promptService.importFromJson(text);
      refresh();
      if (result.imported > 0) {
        addToast(`Imported ${result.imported} prompts`, 'success');
      }
      if (result.errors > 0) {
        addToast(`${result.errors} prompts failed to import`, 'warning');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    promptService.clearAll();
    refresh();
    setClearDialogOpen(false);
    addToast('All data cleared', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your preferences and data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer -mb-px',
              activeTab === tab.id
                ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === 'profile' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Profile</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Profile management will be available when authentication is enabled.
            Currently, PromptVault stores all data locally on this device.
          </p>
        </div>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Preferences & Localization</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Configure language, reading direction, and library display options.
            </p>
          </div>

          <div className="space-y-4">
            {/* Language Selector */}
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <div>
                <div className="text-sm font-medium text-[var(--color-text)]">{t('language')}</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Select interface language and text orientation
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={cn(
                    'px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                    language === 'ar'
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                  )}
                >
                  {language === 'ar' && <Check className="w-3 h-3" />}
                  العربية (RTL)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={cn(
                    'px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                    language === 'en'
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                  )}
                >
                  {language === 'en' && <Check className="w-3 h-3" />}
                  English (LTR)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <div>
                <div className="text-sm font-medium text-[var(--color-text)]">Bi-directional Text (RTL / LTR)</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Automatically aligns Arabic text to the right and English/Code to the left.
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success-light)] px-2.5 py-1 rounded-full">
                Active (Auto-Detect)
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <div>
                <div className="text-sm font-medium text-[var(--color-text)]">Default Sort Order</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Order in which prompts appear in library listings.
                </div>
              </div>
              <span className="text-xs font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-md)]">
                Newest First
              </span>
            </div>

            {/* PWA App Installation Row */}
            <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text)]">
                    {language === 'ar' ? 'تطبيق الويب المستقل (PWA)' : 'Progressive Web App (PWA)'}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {language === 'ar'
                      ? 'تثبيت التطبيق على جهازك للوصول الفوري والعمل أوفلاين'
                      : 'Install app directly to your home screen or desktop'}
                  </div>
                </div>
              </div>
              {isInstalled ? (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'التطبيق مثبّت' : 'Installed'}
                </span>
              ) : (
                <Button
                  size="sm"
                  onClick={() => promptInstall()}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  {language === 'ar' ? 'تثبيت الآن' : 'Install App'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('appearance')}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Select your preferred display theme based on Realtime Colors palette
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light' as Theme, icon: Sun, label: t('lightTheme') },
              { id: 'dark' as Theme, icon: Moon, label: t('darkTheme') },
              { id: 'system' as Theme, icon: Monitor, label: t('systemTheme') },
            ].map((th) => {
              const isSelected = theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 px-6 py-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer',
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)] shadow-xs'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]',
                  )}
                >
                  <th.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">Export Library</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Export your entire library ({prompts.length} prompts) in your preferred format for backup or external workflows.
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button variant="outline" onClick={handleExportJson} icon={<Download className="w-4 h-4" />}>
                Export as JSON
              </Button>
              <Button variant="outline" onClick={handleExportMarkdown} icon={<Download className="w-4 h-4" />}>
                Export as Markdown (.md)
              </Button>
              <Button variant="outline" onClick={handleExportCsv} icon={<Download className="w-4 h-4" />}>
                Export as CSV
              </Button>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">Import Data</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Import prompts from a JSON file. Existing prompts will not be overwritten.
            </p>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} icon={<Upload className="w-4 h-4" />}>
              Import Prompts
            </Button>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-error)]/20 rounded-[var(--radius-xl)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-error)] mb-1">Danger Zone</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Delete all prompts and data. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={() => setClearDialogOpen(true)} icon={<Trash2 className="w-4 h-4" />}>
              Clear All Data
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Data"
        description={`This will permanently delete all ${prompts.length} prompts and cannot be undone. We recommend exporting your data first.`}
        confirmLabel="Delete Everything"
      />
    </div>
  );
}
