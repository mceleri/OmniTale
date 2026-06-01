import React, { useState } from 'react';
import { useStoryStore, Adventure } from '../store/useStoryStore';
import { Plus, BookOpen, Trash2, Clock, Sparkles, Settings, X, ChevronRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { savedStories, selectStory, createStory, deleteStory, setView } = useStoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [charName, setCharName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Fantasy');

  const genres = [
    {
      name: 'Fantasy',
      description: 'An ancient land of forgotten magic, runic ruins, and wild forests.',
      defaultTitle: 'The Lost Sanctuary',
      defaultChar: 'Alandra the Mage',
      emoji: '🧙‍♂️'
    },
    {
      name: 'Sci-Fi',
      description: 'A deep space mining outpost plagued by a mysterious acoustic signal.',
      defaultTitle: 'Acoustic Rift: Europa',
      defaultChar: 'Eng. Marcus Thorne',
      emoji: '🧑‍🚀'
    },
    {
      name: 'Cyberpunk',
      description: 'Rain-slicked neon streets, corrupt corps, and high-tech deck hacking.',
      defaultTitle: 'Neon Overdrive',
      defaultChar: 'Vex the Decker',
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
      selectedGenre
    );

    // Reset fields
    setTitle('');
    setCharName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen px-6 py-8 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-zinc-100 font-medium">
              OmniTale
            </h1>
            <p className="text-xs font-sans text-zinc-500 uppercase tracking-widest mt-1">
              Solo RPG Reader
            </p>
          </div>
          <button
            onClick={() => setView('settings')}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-zinc-500 stroke-[1.5]" />
          </button>
        </div>

        {/* Intro */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mb-8 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-medium text-zinc-200">The Zen E-Reader of Roleplaying</h2>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                A minimal space for your thoughts. Choose a narrative, play your character, and build your legend in silence.
              </p>
            </div>
          </div>
        </div>

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

        {/* List of Stories */}
        <div className="mt-10">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Your Stories ({savedStories.length})
          </h3>
          
          {savedStories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs text-zinc-500">No stories active. Launch a new adventure.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedStories.map((story: Adventure) => (
                <div
                  key={story.id}
                  className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 transition-all hover:border-zinc-700/80 cursor-pointer flex flex-col justify-between"
                  onClick={() => selectStory(story.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-serif text-lg text-zinc-200 group-hover:text-zinc-100 truncate">
                          {story.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full shrink-0">
                          {story.genre || 'Fantasy'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0 self-center transition-transform group-hover:translate-x-0.5" />
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 mt-4 pt-3 text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" />
                      {story.lastPlayed}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${story.title}"? This cannot be undone.`)) {
                          deleteStory(story.id);
                        }
                      }}
                      className="p-1 text-zinc-600 hover:text-red-400 rounded transition"
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
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600">
        OmniTale Reader v1.1.0 • Elegant Minimalist Solo RPG Interface
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
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
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
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Adventure Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Forgotten Vault"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Your Character Name
                </label>
                <input
                  type="text"
                  required
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  placeholder="e.g. Gerald the Wise"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Setting Synopsis (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief intro to set the scene..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 placeholder-zinc-600 resize-none"
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
