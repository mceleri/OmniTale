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
        llmUrl: state.llmUrl,
        llmKey: state.llmKey,
        modelName: state.modelName,
        currentView: state.currentView,
        activeStoryId: state.activeStoryId,
        masterFeedback: state.masterFeedback,
      }),
    }
  )
);
