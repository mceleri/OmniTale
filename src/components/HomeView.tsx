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
  const [charName, setCharName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Fantasy');
  
  // Local state for segmented filtering
  const [filter, setFilter] = useState<'all' | 'tales' | 'templates'>('all');

  const genres = [
    {
      name: 'Fantasy',
      description: 'An ancient land of forgotten magic, runic ruins, and wild forests.',
      defaultTitle: 'The Lost Sanctuary',
      defaultChar: 'Alandra the Ranger',
      emoji: '🧙‍♂️'
    },
    {
      name: 'Sci-Fi',
      description: 'A deep space mining outpost plagued by a mysterious acoustic signal.',
      defaultTitle: 'Acoustic Rift: Europa',
      defaultChar: 'Dr. Isaac Clarke',
      emoji: '🧑‍🚀'
    },
    {
      name: 'Cyberpunk',
      description: 'Rain-slicked neon streets, corrupt corps, and high-tech deck hacking.',
      defaultTitle: 'Neon Overdrive',
      defaultChar: 'Kaelen Vex',
      emoji: '💾'
    },
    {
      name: 'Gothic Horror',
      description: 'A crumbling Victorian manor where ancestral shadows refuse to stay dead.',
      defaultTitle: 'The Whispers of Blackwood',
      defaultChar: 'Victoria Crane',
      emoji: '🕯️'
    }
  ];

  const handleGenreSelect = (genre: typeof genres[0]) => {
    setSelectedGenre(genre.name);
    setTitle(genre.defaultTitle);
    setCharName(genre.defaultChar);
    setDescription(genre.description);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !charName.trim()) return;

    createStory(
      title.trim(),
      description.trim() || 'A mysterious journey across unknown frontiers.',
      charName.trim(),
      selectedGenre,
      'tale' // Playable stories created from Home are tales
    );

    // Reset fields
    setTitle('');
    setCharName('');
    setDescription('');
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
            setIsModalOpen(true);
            handleGenreSelect(genres[0]); // pre-fill with fantasy
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

      {/* Creation Modal (Sleek Dialog) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-sm p-6 overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-zinc-200">Start a Journey</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Choose Setting / Genre
              </label>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => handleGenreSelect(g)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedGenre === g.name
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-200'
                        : 'bg-zinc-900/30 border-zinc-800/80 text-zinc-400 hover:border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      <span>{g.emoji}</span>
                      <span>{g.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Adventure Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Forgotten Vault"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Your Character Name
                </label>
                <input
                  type="text"
                  required
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  placeholder="e.g. Gerald the Wise"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Setting Synopsis (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief intro to set the scene..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-sm rounded-xl transition"
              >
                Embark on Adventure
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};