import React, { useState } from 'react';
import { useStoryStore, Story } from '../store/useStoryStore';
import { Plus, BookOpen, Trash2, Clock, Sparkles, Settings, X, ChevronRight } from 'lucide-react';

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

export const HomeView: React.FC = () => {
  const { stories, selectStory, createStory, deleteStory, setView } = useStoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  
  // Local state for dynamic worldbuilding blocks
  const [blocks, setBlocks] = useState<{ id: number; title: string; content: string }[]>([
    { id: 1, title: 'Setting', content: '' }
  ]);

  // Local state for segmented filtering
  const [filter, setFilter] = useState<'all' | 'tales' | 'templates'>('all');

  const compileMarkdown = () => {
    return blocks
      .map(b => `## ${b.title || 'Untitled Aspect'}\n\n${b.content || ''}`)
      .join('\n\n');
  };

  const handleStartJourney = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const compiledMarkdown = compileMarkdown();
    const synopsis = blocks[0]?.content.trim() || 'A mysterious journey across unknown frontiers.';
    const charBlock = blocks.find(b => b.title.toLowerCase().includes('character'));
    const characterName = charBlock 
      ? charBlock.content.split('\n')[0].replace(/^(Name:\s*)/i, '').trim() || 'Adventurer' 
      : 'Adventurer';

    createStory(
      title.trim(),
      synopsis,
      characterName,
      'Custom', // Genre is inferred / Custom
      'tale', // Active tale
      compiledMarkdown
    );

    // Reset fields
    setTitle('');
    setBlocks([{ id: Date.now(), title: 'Setting', content: '' }]);
    setIsModalOpen(false);
  };

  const handleSaveTemplate = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const compiledMarkdown = compileMarkdown();
    const synopsis = blocks[0]?.content.trim() || 'A customizable template for your adventures.';
    const charBlock = blocks.find(b => b.title.toLowerCase().includes('character'));
    const characterName = charBlock 
      ? charBlock.content.split('\n')[0].replace(/^(Name:\s*)/i, '').trim() || 'Adventurer' 
      : 'Adventurer';

    createStory(
      title.trim(),
      synopsis,
      characterName,
      'Custom', // Genre is inferred / Custom
      'template', // Template draft
      compiledMarkdown
    );

    // Reset fields
    setTitle('');
    setBlocks([{ id: Date.now(), title: 'Setting', content: '' }]);
    setIsModalOpen(false);
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
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-zinc-300 mt-0.5 shrink-0" />
              <div>
                <h2 className="text-sm font-medium text-zinc-200">Continue Journey</h2>
                <p className="text-xs text-zinc-100 font-serif mt-1 font-semibold truncate max-w-[260px]">
                  {recentStory.title}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Last played {formatRelativeTime(recentStory.updatedAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => selectStory(recentStory.id)}
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl transition active:scale-[0.98]"
            >
              Resume
            </button>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={() => {
            setBlocks([{ id: Date.now(), title: 'Setting', content: '' }]);
            setTitle('');
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
                ? 'bg-zinc-100 text-zinc-950'
                : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('tales')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'tales'
                ? 'bg-zinc-100 text-zinc-950'
                : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            Tales
          </button>
          <button
            onClick={() => setFilter('templates')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'templates'
                ? 'bg-zinc-100 text-zinc-950'
                : 'border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
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
                  className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 transition-all hover:border-zinc-700/80 cursor-pointer flex flex-col justify-between"
                  onClick={() => selectStory(story.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-serif text-lg text-zinc-200 group-hover:text-zinc-100 truncate max-w-[180px]">
                          {story.title}
                        </h4>
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
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {formatRelativeTime(story.updatedAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${story.title}"? This cannot be undone.`)) {
                          deleteStory(story.id);
                        }
                      }}
                      className="p-1 text-zinc-400 hover:text-red-400 rounded transition"
                      title="Delete story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-400">
        OmniTale Reader v1.2.0 • Elegant Minimalist Solo RPG Interface
      </div>

      {/* Creation Modal (Sleek Dialog - Worldbuilding Canvas) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 shrink-0">
              <h3 className="font-serif text-xl text-zinc-200">Worldbuilding Canvas</h3>
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
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Forgotten Vault"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-750 placeholder-zinc-500"
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
                    setBlocks([...blocks, { id: Date.now(), title: '', content: '' }]);
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
    </div>
  );
};