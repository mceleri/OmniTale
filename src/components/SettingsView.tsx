import React, { useState, useRef } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { ArrowLeft, Save, Check, Download, Upload, Terminal, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import { validateBackupPayload } from '../utils/validation';
import { LLMProvider } from '../types/story';

export const SettingsView: React.FC = () => {
  const { llmProvider, llmUrl, llmKey, modelName, useAgenticPipeline, updateLlmSettings, setView, importStore } = useStoryStore();
  const [provider, setProvider] = useState<LLMProvider>(llmProvider || 'local');
  const [url, setUrl] = useState(llmUrl);
  const [key, setKey] = useState(llmKey);
  const [model, setModel] = useState(modelName);
  const [pipeline, setPipeline] = useState<boolean>(useAgenticPipeline || false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
    if (newProvider === 'local') {
      setUrl(url.includes('openrouter') || url.includes('generativelanguage') ? 'http://localhost:11434/v1' : url);
      setModel(model.includes('gemma') || model.includes('gemini') ? 'llama3.1:8b' : model);
    } else if (newProvider === 'openrouter') {
      setUrl('https://openrouter.ai/api/v1/chat/completions');
      setModel('google/gemma-2-9b-it:free');
    } else if (newProvider === 'gemini') {
      setUrl('https://generativelanguage.googleapis.com/v1beta');
      setModel('gemini-flash-latest');
    }
  };

  const applyLocalPreset = (presetUrl: string, presetModel: string) => {
    setUrl(presetUrl);
    setModel(presetModel);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLlmSettings(provider, url.trim(), key.trim(), model.trim(), pipeline);
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
        const validation = validateBackupPayload(json);

        if (!validation.isValid || !validation.data) {
          alert(`Invalid backup file: ${validation.error || 'Unknown error'}`);
          return;
        }

        const confirmImport = window.confirm(
          'Are you sure you want to import this database? This will ERASE all current stories and progress!'
        );
        if (!confirmImport) return;

        importStore(validation.data);
        alert('Database imported successfully!');
      } catch (err) {
        alert('Error parsing JSON backup file: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-md lg:max-w-4xl mx-auto min-h-screen px-6 py-8 flex flex-col justify-between">
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
              LLM & System Configuration
            </p>
          </div>
        </div>

        {/* Form and Backup Container */}
        <div className="space-y-6">
          {/* LLM Settings Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 lg:p-6 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 backdrop-blur-sm">
              <div className="lg:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  LLM Provider (Local / Remote)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'local' as const, label: 'Local (Ollama / vLLM / llama.cpp)', icon: Cpu },
                    { id: 'openrouter' as const, label: 'OpenRouter', icon: Sparkles },
                    { id: 'gemini' as const, label: 'Gemini (Native)', icon: Terminal },
                  ].map((item) => {
                    const active = provider === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleProviderChange(item.id)}
                        className={`py-2.5 px-2 text-xs font-medium rounded-lg border transition flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                          active
                            ? 'bg-zinc-100 border-zinc-100 text-zinc-950 shadow-sm'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Local Quick Presets */}
              {provider === 'local' && (
                <div className="lg:col-span-2 bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Local Inference Quick Presets
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyLocalPreset('http://localhost:11434/v1', 'llama3.1:8b')}
                      className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 rounded-lg transition"
                    >
                      🦙 Ollama (`:11434`)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLocalPreset('http://localhost:1234/v1', 'local-model')}
                      className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 rounded-lg transition"
                    >
                      ⚡ LM Studio (`:1234`)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLocalPreset('http://localhost:8080/v1', 'default')}
                      className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 rounded-lg transition"
                    >
                      🦙 llama.cpp (`:8080`)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyLocalPreset('http://localhost:8000/v1', 'default')}
                      className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 rounded-lg transition"
                    >
                      🚀 vLLM (`:8000`)
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                    💡 <strong className="text-zinc-300">Suggerimento CORS:</strong> Per collegare Ollama da browser, avvialo abilitando i domini web (es. <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300">OLLAMA_ORIGINS="*" ollama serve</code>).
                  </p>
                </div>
              )}

              {/* Free Tier Tips for OpenRouter & Gemini */}
              {provider === 'openrouter' && (
                <div className="lg:col-span-2 bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl">
                  <p className="text-[11px] text-zinc-400 leading-relaxed flex items-center justify-between">
                    <span>
                      Modelli gratuiti supportati: <code className="text-emerald-400">google/gemma-2-9b-it:free</code>, <code className="text-emerald-400">meta-llama/llama-3.1-8b-instruct:free</code>.
                    </span>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-zinc-100 underline text-[11px] inline-flex items-center gap-1 shrink-0 ml-2"
                    >
                      Get Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              )}

              {provider === 'gemini' && (
                <div className="lg:col-span-2 bg-zinc-950/60 border border-zinc-850 p-3 rounded-xl">
                  <p className="text-[11px] text-zinc-400 leading-relaxed flex items-center justify-between">
                    <span>
                      Usa <strong className="text-zinc-300">gemini-flash-latest</strong> o <strong className="text-zinc-300">gemini-2.5-flash</strong> con la quota gratuita di Google AI Studio.
                    </span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-zinc-100 underline text-[11px] inline-flex items-center gap-1 shrink-0 ml-2"
                    >
                      Get Gemini Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  LLM Endpoint URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={provider !== 'local'}
                  placeholder={
                    provider === 'local'
                      ? 'http://localhost:11434/v1'
                      : provider === 'openrouter'
                      ? 'https://openrouter.ai/api/v1/chat/completions'
                      : 'https://generativelanguage.googleapis.com/v1beta'
                  }
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none transition ${
                    provider === 'local'
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-zinc-600'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-500 cursor-not-allowed'
                  }`}
                />
                <p className="text-[10px] text-zinc-500 font-sans mt-1">
                  {provider === 'local'
                    ? 'Inserisci l’indirizzo del tuo server compatibile OpenAI (Ollama, LM Studio, vLLM).'
                    : `Configurato automaticamente per ${provider === 'openrouter' ? 'OpenRouter' : 'Google Gemini'}.`}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  {provider === 'local' ? 'API Key (Opzionale per server locali)' : 'API Key'}
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={
                    provider === 'local'
                      ? 'Non richiesta (o inserisci bearer token se protetto)'
                      : provider === 'openrouter'
                      ? 'Enter OpenRouter API Key (sk-or-...)'
                      : 'Enter Gemini API Key'
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-500 font-mono"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Model Name
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={
                    provider === 'local'
                      ? 'e.g. llama3.1:8b, qwen2.5:7b, mistral'
                      : provider === 'openrouter'
                      ? 'e.g. google/gemma-2-9b-it:free'
                      : 'gemini-flash-latest'
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-500 font-mono"
                />
              </div>

              {/* Agentic Pipeline Toggle */}
              <div className="lg:col-span-2 border-t border-zinc-800/80 pt-4 mt-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                      Agentic Narrative Pipeline (Beta)
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded">
                        2-Step
                      </span>
                    </label>
                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
                      Divide ogni turno in due chiamate LLM sequenziali (Arbitro/Reazione &rarr; Prosa Narrativa con Streaming) per sbloccare iniziativa autonoma dei PNG, logica di mondo e gestione del ritmo.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pipeline}
                    onClick={() => setPipeline(!pipeline)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pipeline ? 'bg-indigo-600' : 'bg-zinc-800'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        pipeline ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-xl transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Impostazioni Salvate con Successo
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salva Impostazioni
                </>
              )}
            </button>
          </form>

          {/* Database Backup Section */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4 backdrop-blur-sm">
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Database Backup & Ripristino
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Esporta le tue storie e i progressi in un file JSON locale, oppure importa un backup precedentemente salvato. I dati restano sempre nel tuo browser.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-medium transition"
              >
                <Download className="w-4 h-4" />
                Esporta DB (.json)
              </button>

              <button
                type="button"
                onClick={handleImportClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-medium transition"
              >
                <Upload className="w-4 h-4" />
                Importa DB (.json)
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
        OmniTale Engine v1.1.0 • Streaming & Local Endpoints abilitati • Dati salvati in IndexedDB locale.
      </div>
    </div>
  );
};
