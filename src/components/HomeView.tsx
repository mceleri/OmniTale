import React, { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Story, NarrativePropensity, StorySections } from '../types/story';
import { Plus, BookOpen, Trash2, Clock, Sparkles, Settings, X, ChevronRight, BarChart2, Loader } from 'lucide-react';
import { fetchNarrative } from '../services/llmService';

const formatRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  if (diff < 60 * 1000) return 'Just now';
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString();
};

const LANGUAGES = [
  { name: 'English', flag: '🇺🇸', native: 'English' },
  { name: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
  { name: 'Español', flag: '🇪🇸', native: 'Español' },
  { name: 'Français', flag: '🇫🇷', native: 'Français' },
  { name: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' },
  { name: 'Português', flag: '🇵🇹', native: 'Português' },
  { name: '日本語', flag: '🇯🇵', native: '日本語' },
  { name: '中文', flag: '🇨🇳', native: '中文' },
];

export const HomeView: React.FC = () => {
  const { stories, selectStory, createStory, updateStory, deleteStory, setView } = useStoryStore();
  const [storyIdToDelete, setStoryIdToDelete] = useState<string | null>(null);
  const storyToDelete = stories.find(s => s.id === storyIdToDelete);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedPropensity, setSelectedPropensity] = useState<NarrativePropensity>('balanced');
  const [pendingJourneyData, setPendingJourneyData] = useState<{
    title: string;
    synopsis: string;
    characterName: string;
    compiledLorebookMarkdown: string;
    characterSheetContent: string;
    sections: StorySections;
    masterJournal?: string;
  } | null>(null);
  const [title, setTitle] = useState('');
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState('');
  
  // Local state for 5-section Worldbuilding Canvas & Propensity
  const [activeCanvasTab, setActiveCanvasTab] = useState<'setting' | 'character' | 'factions' | 'conflicts' | 'history'>('setting');
  const [canvasSetting, setCanvasSetting] = useState('');
  const [canvasCharSheet, setCanvasCharSheet] = useState('');
  const [canvasFactions, setCanvasFactions] = useState('');
  const [canvasConflicts, setCanvasConflicts] = useState('');
  const [canvasHistory, setCanvasHistory] = useState('');
  const [canvasPropensity, setCanvasPropensity] = useState<NarrativePropensity>('balanced');

  // Local state for segmented filtering
  const [filter, setFilter] = useState<'all' | 'tales' | 'templates'>('all');

  const handleStartJourney = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const characterName = canvasCharSheet.split('\n')[0].replace(/^Name:\s*/i, '').trim() || 'Adventurer';
    const synopsis = canvasSetting.slice(0, 200).trim() || 'A mysterious journey across unknown frontiers.';
    const compiledLorebookMarkdown = [
      canvasSetting ? `## Setting\n${canvasSetting}` : '',
      canvasFactions ? `## Factions\n${canvasFactions}` : '',
      canvasConflicts ? `## Conflicts\n${canvasConflicts}` : '',
      canvasHistory ? `## Historical Facts\n${canvasHistory}` : '',
    ].filter(Boolean).join('\n\n');

    const sourceTemplateJournal = editingStoryId
      ? stories.find((s) => s.id === editingStoryId)?.dynamicState.masterJournal
      : undefined;

    setPendingJourneyData({
      title: title.trim(),
      synopsis,
      characterName,
      compiledLorebookMarkdown,
      characterSheetContent: canvasCharSheet || `Name: ${characterName}`,
      sections: {
        setting: canvasSetting,
        characterSheet: canvasCharSheet,
        factions: canvasFactions,
        conflicts: canvasConflicts,
        historicalFacts: canvasHistory,
      },
      masterJournal: sourceTemplateJournal,
    });
    setSelectedPropensity(canvasPropensity);
    setIsLanguageModalOpen(true);
  };

  const handleConfirmLanguage = async () => {
    if (!pendingJourneyData) return;

    const state = useStoryStore.getState();
    const key = state.llmKey;
    const url = state.llmUrl;
    const model = state.modelName;

    let finalTitle = pendingJourneyData.title;
    let finalSynopsis = pendingJourneyData.synopsis;
    let finalLorebook = pendingJourneyData.compiledLorebookMarkdown;
    let finalCharSheet = pendingJourneyData.characterSheetContent;
    let finalJournal = pendingJourneyData.masterJournal && pendingJourneyData.masterJournal.trim().length > 50
      ? pendingJourneyData.masterJournal.trim()
      : `// AI Master Notes — ${finalTitle}\n// Act 1: The First Step\n- Character: ${pendingJourneyData.characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`;
    let finalSections = pendingJourneyData.sections;

    if (key) {
      setIsTranslating(true);
      setTranslationStatus('Translating adventure...');
      try {
        const translateField = async (text: string, systemPrompt: string): Promise<string> => {
          if (!text.trim()) return text;
          try {
            const result = await fetchNarrative(
              state.llmProvider || 'openrouter',
              url,
              key,
              model,
              systemPrompt,
              [{ id: 'trans_' + Date.now() + Math.random(), role: 'player', content: text }]
            );
            return result.trim() || text;
          } catch (err) {
            console.error('Field translation error:', err);
            return text;
          }
        };

        const titlePrompt = `You are a professional translator. Translate the following adventure title into ${selectedLanguage}. Make it sound natural, evocative, and epic in ${selectedLanguage}. Return ONLY the translated title text, with no explanations, no quotes, and no extra commentary.`;
        const synopsisPrompt = `You are an expert fantasy/RPG translator. Translate the following adventure synopsis into ${selectedLanguage}. Keep it engaging, dramatic, and atmospheric. Return ONLY the translated synopsis text, with no explanations or metadata.`;
        const charSheetPrompt = `You are an expert RPG system translator. Translate the following character sheet into ${selectedLanguage}. Preserve the original text structure, layout, newlines, and labels exactly. Return ONLY the translated character sheet.`;
        const lorebookPrompt = `You are an expert fantasy worldbuilding translator. Translate the following lorebook markdown content into ${selectedLanguage}. Preserve all markdown syntax exactly. Return ONLY the translated markdown.`;
        const journalPrompt = `You are a Game Master assistant. Translate the following GM notes/journal into ${selectedLanguage}. Preserve the format, bullet points, and comment markers exactly. Return ONLY the translated notes.`;
        const sectionSettingPrompt = `You are an expert RPG translator. Translate the following world setting description into ${selectedLanguage}. Preserve the tone, imagery, and paragraphs. Return ONLY the translated text.`;
        const sectionFactionsPrompt = `You are an expert RPG translator. Translate the following factions and groups into ${selectedLanguage}. Preserve the bullet points and structure exactly. Return ONLY the translated text.`;
        const sectionConflictsPrompt = `You are an expert RPG translator. Translate the following structural conflicts and frictions into ${selectedLanguage}. Preserve the bullet points and structure exactly. Return ONLY the translated text.`;
        const sectionHistoryPrompt = `You are an expert RPG translator. Translate the following historical facts and established lore into ${selectedLanguage}. Preserve the bullet points and structure exactly. Return ONLY the translated text.`;

        const [
          translatedTitle,
          translatedSynopsis,
          translatedCharSheet,
          translatedLorebook,
          translatedJournal,
          translatedSetting,
          translatedFactions,
          translatedConflicts,
          translatedHistory,
        ] = await Promise.all([
          translateField(finalTitle, titlePrompt),
          translateField(finalSynopsis, synopsisPrompt),
          translateField(finalCharSheet, charSheetPrompt),
          translateField(finalLorebook, lorebookPrompt),
          translateField(finalJournal, journalPrompt),
          translateField(pendingJourneyData.sections?.setting || '', sectionSettingPrompt),
          translateField(pendingJourneyData.sections?.factions || '', sectionFactionsPrompt),
          translateField(pendingJourneyData.sections?.conflicts || '', sectionConflictsPrompt),
          translateField(pendingJourneyData.sections?.historicalFacts || '', sectionHistoryPrompt),
        ]);

        finalTitle = translatedTitle;
        finalSynopsis = translatedSynopsis;
        finalCharSheet = translatedCharSheet;
        finalLorebook = translatedLorebook;
        finalJournal = translatedJournal;
        finalSections = {
          setting: translatedSetting,
          characterSheet: translatedCharSheet,
          factions: translatedFactions,
          conflicts: translatedConflicts,
          historicalFacts: translatedHistory,
        };

      } catch (error) {
        console.error('Translation process error:', error);
      } finally {
        setIsTranslating(false);
        setTranslationStatus('');
      }
    }

    const charNameMatch = finalCharSheet.match(/^Name:\s*(.+)$/m) || finalCharSheet.match(/^Nome:\s*(.+)$/m) || finalCharSheet.match(/^Nombre:\s*(.+)$/m) || finalCharSheet.match(/^Nom:\s*(.+)$/m);
    const finalCharName = charNameMatch ? charNameMatch[1].trim() : pendingJourneyData.characterName;

    createStory(
      finalTitle,
      finalSynopsis,
      finalCharName,
      'Custom', // Genre is inferred / Custom
      'tale', // Active tale
      finalLorebook,
      finalCharSheet,
      finalJournal, // Pass the translated journal
      selectedLanguage,
      undefined,
      selectedPropensity,
      finalSections
    );

    // Reset fields
    setTitle('');
    setCanvasSetting('');
    setCanvasCharSheet('');
    setCanvasFactions('');
    setCanvasConflicts('');
    setCanvasHistory('');
    setCanvasPropensity('balanced');
    setEditingStoryId(null);
    setIsModalOpen(false);
    setIsLanguageModalOpen(false);
    setPendingJourneyData(null);
  };

  const handleSaveTemplate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const sections: StorySections = {
      setting: canvasSetting,
      characterSheet: canvasCharSheet,
      factions: canvasFactions,
      conflicts: canvasConflicts,
      historicalFacts: canvasHistory,
    };

    const compiledLorebookMarkdown = [
      canvasSetting ? `## Setting\n${canvasSetting}` : '',
      canvasFactions ? `## Factions\n${canvasFactions}` : '',
      canvasConflicts ? `## Conflicts\n${canvasConflicts}` : '',
      canvasHistory ? `## Historical Facts\n${canvasHistory}` : '',
    ].filter(Boolean).join('\n\n');

    const characterName = canvasCharSheet.split('\n')[0].replace(/^Name:\s*/i, '').trim() || 'Adventurer';
    const synopsis = canvasSetting.slice(0, 200).trim() || 'A mysterious journey across unknown frontiers.';

    if (editingStoryId) {
      updateStory(
        editingStoryId,
        title.trim(),
        synopsis,
        characterName,
        compiledLorebookMarkdown,
        canvasCharSheet,
        undefined,
        undefined,
        canvasPropensity,
        sections
      );
    } else {
      createStory(
        title.trim(),
        synopsis,
        characterName,
        'Custom', // Genre is inferred / Custom
        'template', // Template draft
        compiledLorebookMarkdown,
        canvasCharSheet,
        undefined,
        undefined,
        undefined,
        canvasPropensity,
        sections
      );
    }

    // Reset fields
    setTitle('');
    setCanvasSetting('');
    setCanvasCharSheet('');
    setCanvasFactions('');
    setCanvasConflicts('');
    setCanvasHistory('');
    setCanvasPropensity('balanced');
    setEditingStoryId(null);
    setIsModalOpen(false);
  };

  const handleSelectStoryOrTemplate = (story: Story) => {
    if (story.type === 'template') {
      setTitle(story.title);
      setCanvasSetting(story.dynamicState.setting || story.dynamicState.lorebook || '');
      setCanvasCharSheet(story.dynamicState.characterSheet || '');
      setCanvasFactions(story.dynamicState.factions || '');
      setCanvasConflicts(story.dynamicState.conflicts || '');
      setCanvasHistory(story.dynamicState.historicalFacts || '');
      const prop = story.narrativePropensity || 'balanced';
      setCanvasPropensity(prop);
      setSelectedPropensity(prop);
      setEditingStoryId(story.id);
      setActiveCanvasTab('setting');
      setIsModalOpen(true);
    } else {
      selectStory(story.id);
    }
  };

  // Find the story with the most recent updatedAt timestamp
  const recentStory = stories.length > 0
    ? [...stories].sort((a, b) => b.updatedAt - a.updatedAt)[0]
    : null;

  // Filtered list of stories based on pill state
  const filteredStories = stories.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'tales') return s.type === 'tale';
    if (filter === 'templates') return s.type === 'template';
    return true;
  });

  return (
    <div className="max-w-md lg:max-w-none lg:w-full mx-auto min-h-screen px-6 lg:px-4 py-8 flex flex-col justify-between">
      <div>
        {/* Header - No solo rpg tagline */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-zinc-100 font-medium">
              OmniTale
            </h1>
          </div>
          <button
            onClick={() => setView('settings')}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-zinc-400 stroke-[1.5]" />
          </button>
        </div>

        {/* Dynamic Hero Card (Top Section) */}
        {!recentStory ? (
          /* State A: Store is empty */
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm lg:max-w-xl lg:mx-auto lg:w-full">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-zinc-300 mt-0.5 shrink-0" />
              <div>
                <h2 className="text-sm font-medium text-zinc-200">Forge your world.</h2>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                  Shape the narrative and live the adventure. An endless multiverse of interactive stories awaits your command.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* State B: Has stories - Quick Resume Card */
          <div
            onClick={() => handleSelectStoryOrTemplate(recentStory)}
            className="group wrapper-card bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm cursor-pointer transition-all hover:border-zinc-700/60 flex items-center justify-between gap-4 lg:max-w-xl lg:mx-auto lg:w-full"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Sparkles className="w-5 h-5 text-zinc-300 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-zinc-200">
                  {recentStory.type === 'template' ? 'Edit Template' : 'Continue Journey'}
                </h2>
                <p className="text-xs text-zinc-100 font-serif mt-1 font-semibold truncate max-w-[240px] lg:max-w-[420px]">
                  {recentStory.title}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Last played {formatRelativeTime(recentStory.updatedAt)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={() => {
            setTitle('');
            setCanvasSetting('');
            setCanvasCharSheet('');
            setCanvasFactions('');
            setCanvasConflicts('');
            setCanvasHistory('');
            setCanvasPropensity('balanced');
            setSelectedPropensity('balanced');
            setEditingStoryId(null);
            setActiveCanvasTab('setting');
            setIsModalOpen(true);
          }}
          className="w-full lg:max-w-xs lg:mx-auto flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-xl transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Adventure
        </button>

        {/* Segmented Filter row replacing YOUR STORIES title */}
        <div className="mt-10 mb-5 flex gap-2 lg:justify-center lg:mt-12 lg:mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('tales')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'tales'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            Tales
          </button>
          <button
            onClick={() => setFilter('templates')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'templates'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            Templates
          </button>
        </div>

        {/* List of filtered stories */}
        <div>
          {filteredStories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
              <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs text-zinc-400">No matching stories found.</p>
            </div>
          ) : (
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
              {filteredStories.map((story: Story) => (
                <div
                  key={story.id}
                  className="group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-5 transition-all hover:border-zinc-700/80 cursor-pointer flex flex-col justify-between lg:min-h-[260px]"
                  onClick={() => handleSelectStoryOrTemplate(story)}
                >
                  <div className="flex justify-between items-start gap-4">
                     <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg lg:text-xl text-zinc-200 group-hover:text-zinc-100 truncate mb-1">
                        {story.title}
                      </h4>
                      <div className="flex flex-row gap-2 items-center mb-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full shrink-0">
                          {story.genre}
                        </span>
                        {/* Type Indicator Badges */}
                        {story.type === 'tale' ? (
                          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded-full shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Playing
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-full shrink-0">
                            Template
                          </span>
                        )}
                      </div>
                      <p className="text-xs lg:text-sm text-zinc-300 line-clamp-2 lg:line-clamp-4 leading-relaxed">
                        {story.synopsis}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 mt-4 pt-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRelativeTime(story.updatedAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          useStoryStore.setState({ activeStoryId: story.id, currentView: 'analytics' });
                        }}
                        className="p-1 text-zinc-400 hover:text-emerald-400 rounded transition flex items-center gap-1"
                        title="View Token Analytics & Diagnostics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span className="font-sans font-medium text-[10px]">Stats</span>
                      </button>
                      <span className="text-zinc-800 select-none">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryIdToDelete(story.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-red-400 rounded transition"
                        title="Delete story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-400">
        OmniTale Reader v1.3.0 • Elegant Minimalist Solo RPG Interface
      </div>

      {/* Creation Modal (Sleek Dialog - Worldbuilding Canvas) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-md lg:max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
              <h3 className="font-serif text-xl text-zinc-200">
                {editingStoryId ? 'Edit Template' : 'Worldbuilding Canvas'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 gap-1 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'setting', label: 'Setting', icon: '🌍' },
                { id: 'character', label: 'Character', icon: '👤' },
                { id: 'factions', label: 'Factions', icon: '⚔️' },
                { id: 'conflicts', label: 'Conflicts', icon: '⚡' },
                { id: 'history', label: 'Historical Facts', icon: '📜' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCanvasTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeCanvasTab === tab.id
                      ? 'border-zinc-100 text-zinc-100 bg-zinc-900/60'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {/* Adventure Title */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Adventure Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Forgotten Vault"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-500"
                />
              </div>

              {/* Tab 1: Setting */}
              {activeCanvasTab === 'setting' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-zinc-950/50 border border-zinc-850/70 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
                    🌍 <strong>World Setting & Tone:</strong> Defines atmosphere, geography, mood, and reality rules. The AI Master strictly uses this as tone and consistency guidelines without forcing active plot mandates.
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Setting Atmosphere & Lore
                    </label>
                    <textarea
                      value={canvasSetting}
                      onChange={(e) => setCanvasSetting(e.target.value)}
                      placeholder="Describe the environment, aesthetics, architecture, weather, and world rules..."
                      rows={7}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none font-sans"
                    />
                  </div>

                  {/* Default Narrative Propensity in Setting Tab */}
                  <div className="pt-2 border-t border-zinc-800/60">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                      Default Narrative Propensity
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'character_driven',
                          label: 'Character-Driven',
                          icon: '🎭',
                          desc: 'Dialogue, tridimensional psychology, personal dilemmas, companion banter & atmospheric downtime.',
                        },
                        {
                          id: 'balanced',
                          label: 'Balanced',
                          icon: '⚖️',
                          desc: 'Harmonious alternation between tactical action, social roleplay, and environmental exploration.',
                        },
                        {
                          id: 'plot_driven',
                          label: 'Plot-Driven',
                          icon: '⚡',
                          desc: 'Forward momentum, escalating stakes, ticking clocks, active complications & emergent threats.',
                        },
                      ].map((option) => {
                        const isSelected = canvasPropensity === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setCanvasPropensity(option.id as any);
                              setSelectedPropensity(option.id as any);
                            }}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                              isSelected
                                ? 'bg-zinc-800/80 border-zinc-600 text-zinc-100 shadow-md'
                                : 'bg-zinc-950/40 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                              <span>{option.icon}</span>
                              <span>{option.label}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1.5 leading-snug">
                              {option.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Character Sheet */}
              {activeCanvasTab === 'character' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-zinc-950/50 border border-zinc-850/70 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
                    👤 <strong>Character Sheet Guidelines:</strong> Protagonist name, qualitative traits, demeanor, capabilities, cover identities, and equipment. Qualitative guidelines only — no numerical stats or HP trackers.
                  </div>
                  <textarea
                    value={canvasCharSheet}
                    onChange={(e) => setCanvasCharSheet(e.target.value)}
                    placeholder={`Name: Adventurer\nRole: Wandering Scholar & Scout\n\nQualitative Demeanor & Traits:\n- Observant, cautious, respectful of ancient ruins.\n\nCapabilities & Skills:\n- Herbalism, cartography, light swordsmanship.\n\nEquipment:\n- Traveling cloak, brass compass, leather satchel, iron rations.`}
                    rows={12}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none font-mono"
                  />
                </div>
              )}

              {/* Tab 3: Factions */}
              {activeCanvasTab === 'factions' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-zinc-950/50 border border-zinc-850/70 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
                    ⚔️ <strong>Factions & Competing Agendas:</strong> Active organizations, guilds, or powers. Each faction must possess its own internal logic and goals, rather than simply existing to oppose the player.
                  </div>
                  <textarea
                    value={canvasFactions}
                    onChange={(e) => setCanvasFactions(e.target.value)}
                    placeholder={`- The Sylvan Wardens: Elven druids sworn to protect the forest from outside exploitation.\n- The High Arcane Conclave: Scholars seeking lost magical engines to sustain city infrastructure.\n- The Merchant League: Trade oligarchy seeking open riverways and low tariffs.`}
                    rows={12}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none font-sans"
                  />
                </div>
              )}

              {/* Tab 4: Conflicts */}
              {activeCanvasTab === 'conflicts' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-zinc-950/50 border border-zinc-850/70 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
                    ⚡ <strong>Structural Conflicts:</strong> Relational friction, jurisdictional disputes, and competing interests between factions. Generative material for the master to draw from when organically relevant.
                  </div>
                  <textarea
                    value={canvasConflicts}
                    onChange={(e) => setCanvasConflicts(e.target.value)}
                    placeholder={`- Territorial standoff between woodland wardens and university expeditions.\n- Economic competition over river trade rights between merchant cartels and provincial towns.\n- Inquisitorial scrutiny over untaxed alchemical imports.`}
                    rows={12}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none font-sans"
                  />
                </div>
              )}

              {/* Tab 5: Historical Facts */}
              {activeCanvasTab === 'history' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-zinc-950/50 border border-zinc-850/70 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
                    📜 <strong>Historical Facts & Established Lore:</strong> Past covenants, founding legends, and historical facts. Used by the AI Master purely as atmospheric color and consistency context — never as active quest mandates.
                  </div>
                  <textarea
                    value={canvasHistory}
                    onChange={(e) => setCanvasHistory(e.target.value)}
                    placeholder={`- Three centuries ago, the Cataclysm of the Pale Moon opened planar fissures across the mountains.\n- The realm's civil charter was established following the historic Peace of Valoria.\n- The ancient sanctuary was carved by elven architects directly from living bedrock.`}
                    rows={12}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-zinc-700 placeholder-zinc-600 resize-none font-sans"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer (Sticky / Fixed at bottom) */}
            <div className="px-6 py-4 border-t border-zinc-800/60 bg-zinc-900 shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={!title.trim()}
                className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent text-zinc-300 font-medium text-xs rounded-xl transition text-center"
              >
                Save Template
              </button>
              <button
                type="button"
                onClick={handleStartJourney}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100 text-zinc-950 font-semibold text-xs rounded-xl transition text-center"
              >
                Start Journey
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Language & Narrative Propensity Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fade-in" id="language-selection-modal">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 flex flex-col space-y-5 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl text-zinc-100 font-medium">
                Configure Your Journey
              </h3>
              <p className="text-xs text-zinc-400">
                Choose the narrative propensity and language for the AI Game Master.
              </p>
            </div>

            {/* Narrative Propensity Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <span>Narrative Propensity</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-sans">Can be changed mid-game</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'character_driven',
                    label: 'Character',
                    icon: '🎭',
                    desc: 'Psychology, dialogue & quiet downtime',
                  },
                  {
                    id: 'balanced',
                    label: 'Balanced',
                    icon: '⚖️',
                    desc: 'Equal action, roleplay & exploration',
                  },
                  {
                    id: 'plot_driven',
                    label: 'Plot',
                    icon: '⚡',
                    desc: 'Urgent stakes, momentum & complications',
                  },
                ].map((p) => {
                  const isSelected = selectedPropensity === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isTranslating}
                      onClick={() => setSelectedPropensity(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                        isSelected
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold shadow-md'
                          : 'bg-zinc-950/50 border-zinc-850 text-zinc-300 hover:border-zinc-700'
                      } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>{p.icon}</span>
                        <span className="truncate">{p.label}</span>
                      </div>
                      <p className={`text-[9px] mt-1.5 leading-snug ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200 block">
                Narration Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.name;
                  return (
                    <button
                      key={lang.name}
                      type="button"
                      disabled={isTranslating}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold shadow-sm'
                          : 'bg-zinc-950/50 border-zinc-850 text-zinc-300 hover:border-zinc-700'
                      } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-lg" role="img" aria-label={lang.name}>
                        {lang.flag}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-sans truncate">{lang.native}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-zinc-600' : 'text-zinc-500'} font-sans truncate`}>
                          {lang.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-zinc-950/40 border border-zinc-850/60 rounded-xl p-3 text-[10px] text-zinc-400 leading-relaxed font-sans">
              💡 <strong>AI Master Note:</strong> The Game Master will speak in <strong>{selectedLanguage}</strong> and adapt dynamically to your narrative inputs. Scene plausibility always takes precedence over propensity.
            </div>

            {/* Actions */}
            {isTranslating ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2 bg-zinc-950/30 border border-zinc-850/40 rounded-xl p-3">
                <Loader className="w-5 h-5 text-zinc-400 animate-spin" />
                <span className="text-xs text-zinc-400 font-sans font-medium">{translationStatus}</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLanguageModalOpen(false);
                    setPendingJourneyData(null);
                  }}
                  className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLanguage}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-xl transition shadow-lg shadow-zinc-100/5"
                >
                  Start Adventure
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {storyIdToDelete && storyToDelete && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[70] animate-fade-in" id="delete-confirmation-modal">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xs p-6 flex flex-col space-y-5 shadow-2xl animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/40 flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-zinc-100 font-medium">
                Delete Adventure
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to permanently delete <strong>"{storyToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStoryIdToDelete(null)}
                className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStory(storyToDelete.id);
                  setStoryIdToDelete(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
