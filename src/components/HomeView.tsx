import React, { useState } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Story } from '../types/story';
import { parseMarkdownToBlocks, compileBlocksToMarkdown } from '../utils/markdownParser';
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
  const [pendingJourneyData, setPendingJourneyData] = useState<{
    title: string;
    synopsis: string;
    characterName: string;
    compiledLorebookMarkdown: string;
    characterSheetContent: string;
  } | null>(null);
  const [title, setTitle] = useState('');
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState('');
  
  // Local state for dynamic worldbuilding blocks
  const [blocks, setBlocks] = useState<{ id: string; title: string; content: string }[]>([
    { id: '1', title: 'Setting', content: '' }
  ]);

  // Local state for segmented filtering
  const [filter, setFilter] = useState<'all' | 'tales' | 'templates'>('all');

  const processCanvasBlocks = () => {
    const charBlock = blocks.find(b => b.title.toLowerCase().includes('character'));
    const characterName = charBlock 
      ? charBlock.content.split('\n')[0].replace(/^Name:\s*/i, '').trim() || 'Adventurer' 
      : 'Adventurer';
    
    const characterSheetContent = charBlock ? charBlock.content : `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`;

    const otherBlocks = blocks.filter(b => !b.title.toLowerCase().includes('character'));
    const compiledLorebookMarkdown = compileBlocksToMarkdown(otherBlocks);

    const synopsis = otherBlocks[0]?.content.trim() || 'A mysterious journey across unknown frontiers.';

    return {
      characterName,
      characterSheetContent,
      compiledLorebookMarkdown,
      synopsis
    };
  };

  const handleStartJourney = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const { characterName, characterSheetContent, compiledLorebookMarkdown, synopsis } = processCanvasBlocks();

    // Set pending data and trigger language modal
    setPendingJourneyData({
      title: title.trim(),
      synopsis,
      characterName,
      compiledLorebookMarkdown,
      characterSheetContent
    });
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
    let finalJournal = `// AI Master Notes — ${finalTitle}\n// Act 1: The First Step\n- Character: ${pendingJourneyData.characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`;

    if (key) {
      setIsTranslating(true);
      setTranslationStatus('Traduzione in corso...');
      try {
        const translateField = async (text: string, systemPrompt: string): Promise<string> => {
          if (!text.trim()) return text;
          try {
            const result = await fetchNarrative(
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
        const charSheetPrompt = `You are an expert RPG system translator. Translate the following character sheet into ${selectedLanguage}. Translate labels (like 'Name', 'Attributes', 'Might', 'Agility', 'Intellect', 'Grit', 'Inventory', 'Rations') and description/item names (like 'Leather Satchel') so they sound natural and standard in ${selectedLanguage}. Preserve the original text structure, layout, newlines, and colon style exactly. Return ONLY the translated character sheet.`;
        const lorebookPrompt = `You are an expert fantasy worldbuilding translator. Translate the following lorebook markdown content into ${selectedLanguage}. Translate all prose, titles, and headers naturally, but preserve all markdown syntax (headers, bullet points, bold/italic, etc.) exactly. Return ONLY the translated markdown.`;
        const journalPrompt = `You are a Game Master assistant. Translate the following GM notes/journal into ${selectedLanguage}. Translate all descriptions, goals, and act titles, but preserve the format, bullet points, and comment markers (like '//') exactly. Return ONLY the translated notes.`;

        const [translatedTitle, translatedSynopsis, translatedCharSheet, translatedLorebook, translatedJournal] = await Promise.all([
          translateField(finalTitle, titlePrompt),
          translateField(finalSynopsis, synopsisPrompt),
          translateField(finalCharSheet, charSheetPrompt),
          translateField(finalLorebook, lorebookPrompt),
          translateField(finalJournal, journalPrompt),
        ]);

        finalTitle = translatedTitle;
        finalSynopsis = translatedSynopsis;
        finalCharSheet = translatedCharSheet;
        finalLorebook = translatedLorebook;
        finalJournal = translatedJournal;

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
      selectedLanguage
    );

    // Reset fields
    setTitle('');
    setBlocks([{ id: String(Date.now()), title: 'Setting', content: '' }]);
    setEditingStoryId(null);
    setIsModalOpen(false);
    setIsLanguageModalOpen(false);
    setPendingJourneyData(null);
  };

  const handleSaveTemplate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const { characterName, characterSheetContent, compiledLorebookMarkdown, synopsis } = processCanvasBlocks();

    if (editingStoryId) {
      updateStory(
        editingStoryId,
        title.trim(),
        synopsis,
        characterName,
        compiledLorebookMarkdown,
        characterSheetContent
      );
    } else {
      createStory(
        title.trim(),
        synopsis,
        characterName,
        'Custom', // Genre is inferred / Custom
        'template', // Template draft
        compiledLorebookMarkdown,
        characterSheetContent
      );
    }

    // Reset fields
    setTitle('');
    setBlocks([{ id: String(Date.now()), title: 'Setting', content: '' }]);
    setEditingStoryId(null);
    setIsModalOpen(false);
  };

  const handleSelectStoryOrTemplate = (story: Story) => {
    if (story.type === 'template') {
      const parsedBlocks = parseMarkdownToBlocks(story.dynamicState.lorebook);
      const hasCharBlock = parsedBlocks.some(b => b.title.toLowerCase().includes('character'));
      if (!hasCharBlock && story.dynamicState.characterSheet) {
        parsedBlocks.push({
          id: 'char_temp_' + Date.now(),
          title: 'Character',
          content: story.dynamicState.characterSheet
        });
      }
      setTitle(story.title);
      setBlocks(parsedBlocks);
      setEditingStoryId(story.id);
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
    <div className="max-w-md mx-auto min-h-screen px-6 py-8 flex flex-col justify-between">
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
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm">
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
            className="group wrapper-card bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm cursor-pointer transition-all hover:border-zinc-700/60 flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Sparkles className="w-5 h-5 text-zinc-300 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium text-zinc-200">
                  {recentStory.type === 'template' ? 'Edit Template' : 'Continue Journey'}
                </h2>
                <p className="text-xs text-zinc-100 font-serif mt-1 font-semibold truncate max-w-[240px]">
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
            setBlocks([{ id: '1', title: 'Setting', content: '' }]);
            setTitle('');
            setEditingStoryId(null);
            setIsModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-100 text-zinc-950 font-medium text-sm rounded-xl transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Adventure
        </button>

        {/* Segmented Filter row replacing YOUR STORIES title */}
        <div className="mt-10 mb-5 flex gap-2">
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
            <div className="space-y-4">
              {filteredStories.map((story: Story) => (
                <div
                  key={story.id}
                  className="group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-5 transition-all hover:border-zinc-700/80 cursor-pointer flex flex-col justify-between"
                  onClick={() => handleSelectStoryOrTemplate(story)}
                >
                  <div className="flex justify-between items-start gap-4">
                     <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg text-zinc-200 group-hover:text-zinc-100 truncate max-w-[240px] mb-1">
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
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
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
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
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

            {/* Modal Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {/* Adventure Title */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Adventure Title
                </label>\
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Forgotten Vault"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-500"
                />
              </div>

              {/* Dynamic Worldbuilding Blocks */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Worldbuilding Aspects
                </label>
                
                <div className="space-y-3">
                  {blocks.map((block) => (
                    <div key={block.id} className="relative bg-zinc-950 border border-zinc-850/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => {
                            setBlocks(blocks.map(b => b.id === block.id ? { ...b, title: e.target.value } : b));
                          }}
                          placeholder="e.g. Setting, Magic System, Character..."
                          className="bg-transparent text-sm font-semibold text-zinc-200 focus:outline-none border-b border-transparent focus:border-zinc-700 pb-0.5"
                        />
                        {blocks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setBlocks(blocks.filter(b => b.id !== block.id));
                            }}
                            className="text-zinc-500 hover:text-red-400 p-1 rounded transition shrink-0"
                            title="Remove Aspect"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={block.content}
                        onChange={(e) => {
                          setBlocks(blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b));
                        }}
                        placeholder="Describe this aspect of your world..."
                        rows={3}
                        className="w-full bg-transparent text-xs text-zinc-300 leading-relaxed focus:outline-none placeholder-zinc-500 resize-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Add Aspect Button */}
                <button
                  type="button"
                  onClick={() => {
                    setBlocks([...blocks, { id: 'block_' + Date.now(), title: '', content: '' }]);
                  }}
                  className="w-full py-3 flex items-center justify-center gap-1.5 border border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition active:scale-[0.99]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Aspect
                </button>
              </div>
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

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fade-in" id="language-selection-modal">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 flex flex-col space-y-6 shadow-2xl animate-scale-up">
            
            {/* Header */}
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl text-zinc-100 font-medium">
                Lingua dell'Avventura
              </h3>
              <p className="text-xs text-zinc-400">
                Seleziona la lingua principale per la narrazione dell'AI Game Master.
              </p>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <button
                    key={lang.name}
                    type="button"
                    disabled={isTranslating}
                    onClick={() => setSelectedLanguage(lang.name)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold shadow-md shadow-zinc-100/5'
                        : 'bg-zinc-950/50 border-zinc-850 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700/80'
                    } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-2xl" role="img" aria-label={lang.name}>
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

            {/* Hint Box */}
            <div className="bg-zinc-950/40 border border-zinc-850/60 rounded-xl p-3 text-[10px] text-zinc-400 leading-relaxed font-sans">
              💡 <strong>System Instruction Vincolante:</strong> L'AI Master genererà l'inizio della storia e tutte le risposte in <strong>{selectedLanguage}</strong>. Si adeguerà anche dinamicamente alla lingua che userai nei tuoi messaggi!
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
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLanguage}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-xl transition shadow-lg shadow-zinc-100/5"
                >
                  Inizia Avventura
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
                Elimina Avventura
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sei sicuro di voler eliminare definitivamente <strong>"{storyToDelete.title}"</strong>? Questa azione non può essere annullata.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStoryIdToDelete(null)}
                className="flex-1 py-3 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-xl transition"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStory(storyToDelete.id);
                  setStoryIdToDelete(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/10"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
