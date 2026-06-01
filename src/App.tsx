import React from 'react';
import { useStoryStore } from './store/useStoryStore';
import { HomeView } from './components/HomeView';
import { StoryView } from './components/StoryView';
import { SettingsView } from './components/SettingsView';

const App: React.FC = () => {
  const { currentView } = useStoryStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100 antialiased overflow-x-hidden">
      {currentView === 'home' ? (
        <HomeView />
      ) : currentView === 'settings' ? (
        <SettingsView />
      ) : (
        <StoryView />
      )}
    </div>
  );
};

export default App;
