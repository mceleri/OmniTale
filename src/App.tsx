import React from 'react';
import { useStoryStore } from './store/useStoryStore';
import { HomeView } from './components/HomeView';
import { StoryView } from './components/StoryView';
import { SettingsView } from './components/SettingsView';

const App: React.FC = () => {
  const { currentView, setView } = useStoryStore();

  // Listen for browser back/forward buttons (SPA Back Navigation Interception)
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setView]);

  // Sync currentView changes to browser history
  React.useEffect(() => {
    const state = window.history.state;
    if (!state || state.view !== currentView) {
      window.history.pushState({ view: currentView }, '', '');
    }
  }, [currentView]);

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
