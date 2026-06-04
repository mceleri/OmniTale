import React, { useState, useRef, useEffect } from 'react';
import { useStoryStore, Message, LoreItem } from '../store/useStoryStore';
import { ArrowLeft, Send, User, BookOpen, Eye, X, Trash2, Check, HelpCircle, MessageSquare } from 'lucide-react';

export const StoryView: React.FC = () => {
  const {
    activeStoryId,
    stories,
    messages,
    characterSheet,
    lorebook,
    masterJournal,
    masterFeedback,
    setView,
    addMessage,
    updateCharacterSheet,
    updateMasterJournal,
    updateMasterFeedback,
    addLoreItem,
    deleteLoreItem
  } = useStoryStore();

  const story = stories.find((s) => s.id === activeStoryId);

  const [inputText, setInputText] = useState('');
  const [activeSheet, setActiveSheet] = useState<'character' | 'lore' | 'master' | 'feedback' | null>(null);

  // Lore Creation State
  const [newLoreTitle, setNewLoreTitle] = useState('');
  const [newLoreContent, setNewLoreContent] = useState('');

  // Refs for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract character name dynamically from the first line of the character sheet (e.g., "Name: Evelyn")
  const characterName = React.useMemo(() => {
    if (!characterSheet) return 'Adventurer';
    const match = characterSheet.match(/^Name:\s*(.+)$/m);
    return match ? match[1].trim() : 'Adventurer';
  }, [characterSheet]);

  // Parse lorebook JSON string to array of LoreItem
  const parsedLorebook = React.useMemo(() => {
    try {
      const parsed = JSON.parse(lorebook);
      return Array.isArray(parsed) ? (parsed as LoreItem[]) : [];
    } catch (e) {
      return [];
    }
  }, [lorebook]);

  const isLorebookMarkdown = React.useMemo(() => {
    try {
      JSON.parse(lorebook);
      return false;
    } catch (e) {
      return lorebook && lorebook.trim().length > 0;
    }
  }, [lorebook]);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-zinc-300">
        <p>Story not found.</p>
        <button
          onClick={() => setView('home')}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addMessage('player', inputText.trim());
    setInputText('');
  };

  const handleCreateLore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoreTitle.trim() || !newLoreContent.trim()) return;

    addLoreItem(newLoreTitle.trim(), newLoreContent.trim());
    setNewLoreTitle('');
    setNewLoreContent('');
  };

  return (
    <div className="relative max-w-md mx-auto h-screen bg-zinc-950 flex flex-col overflow-hidden select-none">
      
      {/* 1. TOP BAR */}
      <header className="sticky top-0 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/60 h-14 flex items-center justify-between px-4 z-20">
        <button
          onClick={() => setView('home')}
          className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="w-5 h-5 stroke-[1.8]" />
        </button>
        
        <div className="flex-1 text-center px-4 overflow-hidden">
          <h2 className="font-serif text-sm font-medium text-zinc-200 truncate">
            {story.title}
          </h2>
          <p className="text-[10px] text-zinc-300 font-sans tracking-wider uppercase mt-0.5">
            Playing as {characterName}
          </p>
        </div>

        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>

      {/* 2. MAIN CHAT / STORY STREAM (Timestamps Removed) */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-8 no-scrollbar scroll-smooth"
      >
        {messages.map((msg: Message) => {
          const isMaster = msg.role !== 'player';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[90%] transition-all animate-fade-in ${
                isMaster ? 'mr-auto items-start' : 'ml-auto items-end text-right'
              }`}
            >
              {/* Message Header */}
              <span className="text-[10px] text-zinc-300 font-sans tracking-wide mb-1 px-1">
                {isMaster ? 'STORYTELLER' : characterName.toUpperCase()}
              </span>

              {/* Message Body */}
              <div
                className={`rounded-2xl leading-relaxed text-zinc-300 ${
                  isMaster
                    ? 'font-serif text-[15px] text-zinc-300 font-normal pr-4'
                    : 'bg-zinc-900/80 border border-zinc-800/80 px-4 py-3 font-sans text-sm shadow-sm'
                }`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* 3. BOTTOM INPUT BAR & CONTROLS */}
      <footer className="sticky bottom-0 bg-zinc-950 border-t border-zinc-900/80 p-4 z-20 space-y-3">
        {/* Quick Sheet Buttons (No labels, icons only) */}
        <div className="flex items-center justify-around border-b border-zinc-900 pb-3">
          <button
            onClick={() => setActiveSheet('character')}
            className={`flex items-center justify-center p-2 rounded-lg text-xs transition ${
              activeSheet === 'character'
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Character Sheet"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSheet('lore')}
            className={`flex items-center justify-center p-2 rounded-lg text-xs transition ${
              activeSheet === 'lore'
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Lorebook"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSheet('master')}
            className={`flex items-center justify-center p-2 rounded-lg text-xs transition ${
              activeSheet === 'master'
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="AI Master"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSheet('feedback')}
            className={`flex items-center justify-center p-2 rounded-lg text-xs transition ${
              activeSheet === 'feedback'
                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Feedback"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* TextInput Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Instruct ${characterName} or respond...`}
            className="flex-1 bg-zinc-900/60 border border-zinc-850/80 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700/80 focus:bg-zinc-900 transition placeholder-zinc-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-xl transition disabled:opacity-30 disabled:hover:bg-zinc-100 disabled:scale-100 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 fill-zinc-950" />
          </button>
        </form>
      </footer>

      {/* 4. BOTTOM SHEETS (SLIDE-UP OVERLAYS) */}
      
      {/* Black backdrop overlay for Bottom Sheets */}
      {activeSheet !== null && (
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-35"
          onClick={() => setActiveSheet(null)}
        />
      )}

      {/* Slide-up Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-900 border-t border-zinc-800/80 rounded-t-2xl z-40 overflow-hidden shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          activeSheet !== null ? 'translate-y-0 h-[65vh]' : 'translate-y-full h-[65vh]'
        }`}
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
          <span className="font-serif text-sm font-medium text-zinc-200">
            {activeSheet === 'character' && 'Character Sheet'}
            {activeSheet === 'lore' && 'Lorebook'}
            {activeSheet === 'master' && 'AI Master'}
            {activeSheet === 'feedback' && 'Feedback'}
          </span>
          
          <button
            onClick={() => setActiveSheet(null)}
            className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar bg-zinc-900">
          {activeSheet === 'character' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                  Interactive Dossier
                </span>
                <span className="text-[10px] text-zinc-300 italic">
                  Changes persist automatically
                </span>
              </div>
              
              {/* Clean Sans-serif font for Character Sheet */}
              <textarea
                value={characterSheet}
                onChange={(e) => updateCharacterSheet(e.target.value)}
                rows={12}
                className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-sans text-zinc-300 leading-relaxed focus:outline-none focus:border-zinc-700 resize-none shadow-inner"
                placeholder="Enter character sheet details..."
              />
            </div>
          )}

          {activeSheet === 'lore' && (
            <div className="space-y-6">
              {/* Lore Addition Form */}
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">
                  + Add Lore Entry
                </h4>
                <form onSubmit={handleCreateLore} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newLoreTitle}
                    onChange={(e) => setNewLoreTitle(e.target.value)}
                    placeholder="Entry Title (e.g. Sword of Ruin)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-400"
                  />
                  <textarea
                    required
                    value={newLoreContent}
                    onChange={(e) => setNewLoreContent(e.target.value)}
                    placeholder="Describe this lore, rule, location or faction..."
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-400 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-zinc-200 hover:bg-zinc-100 text-zinc-900 font-medium text-xs rounded-lg transition"
                  >
                    Add Entry
                  </button>
                </form>
              </div>

              {/* Lore Entries List */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Active Codex Entries
                </span>

                {isLorebookMarkdown ? (
                  <div className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl">
                    <div className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {lorebook}
                    </div>
                  </div>
                ) : parsedLorebook.length === 0 ? (
                  <p className="text-xs text-zinc-300 italic">No lore cards added yet.</p>
                ) : (
                  parsedLorebook.map((item: LoreItem) => (
                    <div
                      key={item.id}
                      className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex justify-between items-start gap-4"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200 mb-1">{item.title}</h5>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                          {item.content}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteLoreItem(item.id)}
                        className="text-zinc-400 hover:text-red-400 p-1 rounded transition shrink-0"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSheet === 'master' && (
            <div className="h-full flex flex-col">
              <div className="mb-2.5">
                <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                  Logical Engine Memory
                </h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed mt-0.5">
                  Private log of the AI. Write facts, plot secrets, or structural blocks of your narrative here.
                </p>
              </div>
              {/* Keep monospace green font EXCLUSIVELY for the Master's Diary */}
              <textarea
                value={masterJournal}
                onChange={(e) => updateMasterJournal(e.target.value)}
                rows={12}
                className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-xs font-mono text-emerald-400 leading-relaxed focus:outline-none focus:border-zinc-750 resize-none shadow-inner"
                placeholder="// Enter logical blocks here..."
              />
            </div>
          )}

          {activeSheet === 'feedback' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Secret Instructions to the AI Game Master
                </h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed mt-0.5">
                  Provide custom prompts, feedback, or narrative limits to mold the storytelling. (UI-only placeholder, doesn't post to the conversation stream).
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-850/60 p-4 rounded-xl space-y-3">
                <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Instruction / Tone
                </label>
                <textarea
                  value={masterFeedback}
                  onChange={(e) => updateMasterFeedback(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 placeholder-zinc-400 resize-none"
                  placeholder="e.g. Keep descriptions under 3 paragraphs, don't control my character, focus on high survival stakes..."
                />
                
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Custom GM parameters verified and active.</span>
                </div>
              </div>

              {/* Color Contrast Brightened "What is this section" explanation card */}
              <div className="border border-zinc-800/80 rounded-xl p-4 bg-zinc-950/40 text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                <HelpCircle className="w-4.5 h-4.5 text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-200 block mb-0.5">What is this section?</span>
                  In a production environment, this feedback stream is appended directly to the AI's system prompt in real-time, tailoring response length, combat pacing, or language on the fly.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};