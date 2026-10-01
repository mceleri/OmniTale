import { StateCreator } from 'zustand';
import { StoryState } from '../../types/story';

export interface UISlice {
  currentView: 'home' | 'story' | 'settings' | 'analytics';
  setView: (view: 'home' | 'story' | 'settings' | 'analytics') => void;
}

export const createUISlice: StateCreator<
  StoryState,
  [],
  [],
  UISlice
> = (set) => ({
  currentView: 'home',
  setView: (view) => set({ currentView: view }),
});
