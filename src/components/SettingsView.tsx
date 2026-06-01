import React, { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { ArrowLeft, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { llmUrl, llmKey, updateLlmSettings, setView } = useStoryStore();
  const [url, setUrl] = useState(llmUrl);
  const [key, setKey] = useState(llmKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLlmSettings(url.trim(), key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest mt-0.5">
              Configuration
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                LLM URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.openai.com/v1 or custom URL"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-700 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                LLM Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your LLM API Key"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-700 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-xl transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-650" />
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
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600">
        OmniTale Reader v1.1.0 • Settings configured are saved locally.
      </div>
    </div>
  );
};
