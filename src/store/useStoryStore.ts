import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { idbStorage } from '../utils/storage/idbStorage';
import { StoryState } from '../types/story';
import { createStorySlice } from './createStorySlice';

export const useStoryStore = create<StoryState>()(
  persist(
    (...a) => ({
      ...createStorySlice(...a),
    }),
    {
      name: 'omnitale-storage-idb',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        stories: state.stories,
        llmProvider: state.llmProvider,
        llmUrl: state.llmUrl,
        llmKey: state.llmKey,
        modelName: state.modelName,
        currentView: state.currentView,
        activeStoryId: state.activeStoryId,
        masterFeedback: state.masterFeedback,
      }),
      merge: (persistedState: any, currentState: any) => {
        if (!persistedState) return currentState;

        const mergedStories = [...(persistedState.stories || [])];
        const currentStories = currentState.stories || [];

        // Check for any templates in currentStories (initialStories) that are not in mergedStories or need updating
        currentStories.forEach((currentStory: any) => {
          if (currentStory.type === 'template') {
            const index = mergedStories.findIndex((s: any) => s.id === currentStory.id);
            if (index === -1) {
              mergedStories.push(currentStory);
            } else {
              // Keep the template fresh by overwriting with the hardcoded version in code
              mergedStories[index] = currentStory;
            }
          }
        });

        // Filter out the outdated Italian template ID if it is left in the user's DB
        const cleanStories = mergedStories.filter((s: any) => s.id !== 'echi-del-vuoto');

        // Graceful fallback for legacy storage state missing llmProvider
        const inferredProvider = persistedState.llmProvider || (
          persistedState.llmUrl?.includes('generativelanguage') ? 'gemini' : 'openrouter'
        );

        return {
          ...currentState,
          ...persistedState,
          llmProvider: inferredProvider,
          stories: cleanStories,
        };
      },
    }
  )
);
