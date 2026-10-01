'use client';

import { useState, useRef } from 'react';
import { usePrompts } from '@/contexts/PromptContext';
import { useToast } from '@/contexts/ToastContext';
import { promptService } from '@/services/promptService';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Download, Upload, Trash2, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tab = 'profile' | 'preferences' | 'appearance' | 'data';

export default function SettingsPage() {
  const { prompts, refresh } = usePrompts();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'data', label: 'Data Management' },
  ];

  const handleExport = () => {
    const data = promptService.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptvault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${prompts.length} prompts`, 'success');
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
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Preferences</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Preference settings coming soon. View layout, default sort, and items per page will be configurable here.
          </p>
        </div>
      )}

      {/* Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Appearance</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Choose your preferred theme</p>
          <div className="flex gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' },
            ].map((theme) => (
              <button
                key={theme.id}
                className={cn(
                  'flex flex-col items-center gap-2 px-6 py-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer',
                  theme.id === 'light'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                )}
              >
                <theme.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">Export Data</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Download all your prompts as a JSON file ({prompts.length} prompts).
            </p>
            <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              Export Prompts
            </Button>
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
