import { parseMarkdownToBlocks, compileBlocksToMarkdown, LoreBlock } from '../utils/markdownParser';

export type Role = 'master' | 'player' | 'system_feedback';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export type LoreItem = LoreBlock;

export interface Story {
  id: string;
  type: 'tale' | 'template';
  title: string;
  genre: string;
  synopsis: string;
  dynamicState: {
    characterSheet: string;
    lorebook: string;
    masterJournal: string;
  };
  messages: Message[];
  updatedAt: number;
  createdAt: number;
}

export interface StoryState {
  currentView: 'home' | 'story' | 'settings';
  stories: Story[];
  activeStoryId: string | null;
  masterFeedback: string;
  
  // Settings
  llmUrl: string;
  llmKey: string;
  modelName: string;

  // Loading States
  isGeneratingStory: boolean;
  isUpdatingLorebook: boolean;
  isUpdatingJournal: boolean;
  
  // Actions
  setView: (view: 'home' | 'story' | 'settings') => void;
  selectStory: (storyId: string) => void;
  createStory: (
    title: string,
    synopsis: string,
    characterName: string,
    genre: string,
    type?: 'tale' | 'template',
    lorebook?: string,
    characterSheet?: string,
    masterJournal?: string
  ) => void;
  updateStory: (
    storyId: string,
    title: string,
    synopsis: string,
    characterName: string,
    lorebook: string,
    characterSheet?: string,
    masterJournal?: string
  ) => void;
  deleteStory: (storyId: string) => void;
  addMessage: (role: Role, content: string) => void;
  sendMessage: (content: string) => Promise<void>;
  editLastPlayerMessage: (newContent: string) => Promise<void>;
  deleteLastMessage: () => void;
  updateCharacterSheet: (text: string) => void;
  updateMasterJournal: (text: string) => void;
  updateMasterFeedback: (text: string) => void;
  addLoreItem: (title: string, content: string) => void;
  deleteLoreItem: (itemId: string) => void;
  updateLlmSettings: (url: string, key: string, modelName: string) => void;
  importStore: (data: any) => void;
}
