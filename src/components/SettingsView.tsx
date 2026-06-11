import React, { useState, useRef } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { ArrowLeft, Save, Check, Download, Upload } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { llmUrl, llmKey, modelName, updateLlmSettings, setView, importStore } = useStoryStore();
  const [url, setUrl] = useState(llmUrl);
  const [key, setKey] = useState(llmKey);
  const [model, setModel] = useState(modelName);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLlmSettings(url.trim(), key.trim(), model.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const state = useStoryStore.getState();
    const activeStory = state.stories.find(s => s.id === state.activeStoryId);
    const dataToExport = {
      stories: state.stories,
      currentView: state.currentView,
      activeStoryId: state.activeStoryId,
      messages: activeStory ? activeStory.messages : [],
      characterSheet: activeStory ? activeStory.dynamicState.characterSheet : '',
      lorebook: activeStory ? activeStory.dynamicState.lorebook : '',
      masterJournal: activeStory ? activeStory.dynamicState.masterJournal : '',
      masterFeedback: state.masterFeedback,
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `omnitale-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        if (!json.stories || !Array.isArray(json.stories)) {
          alert('Invalid backup file format. Must contain stories array.');
          return;
        }

        const confirmImport = window.confirm(
          'Are you sure you want to import this database? This will ERASE all current stories and progress!'
        );
        if (!confirmImport) return;

        importStore(json);
        alert('Database imported successfully!');
      } catch (err) {
        alert('Error parsing JSON backup file: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-8 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setView('home')}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
          </button>
          <div>
            <h1 className="text-2xl font-serif tracking-tight text-zinc-100 font-medium">
              Settings
            </h1>
            <p className="text-xs font-sans text-zinc-400 uppercase tracking-widest mt-0.5">
              Configuration
            </p>
          </div>
        </div>

        {/* Form and Backup Container */}
        <div className="space-y-6">
          {/* LLM Settings Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  LLM URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1 or custom URL"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  LLM Key
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your LLM API Key"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Model Name
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="google/gemini-2.5-flash"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-xl transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </form>

          {/* Database Backup Section */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Database Backup
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Export your current stories and progress to a file, or import them from a backup. LLM configuration and keys are excluded.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-medium transition"
              >
                <Download className="w-4 h-4" />
                Export DB
              </button>

              <button
                type="button"
                onClick={handleImportClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-medium transition"
              >
                <Upload className="w-4 h-4" />
                Import DB
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-400">
        OmniTale Reader v1.1.0 • Settings configured are saved locally.
      </div>
    </div>
  );
};
