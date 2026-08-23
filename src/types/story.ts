import { parseMarkdownToBlocks, compileBlocksToMarkdown, LoreBlock } from '../utils/markdownParser';

export type Role = 'master' | 'player' | 'system_feedback';

export interface Message {
  id: string;
  role: Role;
  content: string;
  tokens?: number;
  promptTokens?: number;
}

export type LoreItem = LoreBlock;

export interface Story {
  id: string;
  type: 'tale' | 'template';
  title: string;
  genre: string;
  synopsis: string;
  language?: string;
  dynamicState: {
    characterSheet: string;
    lorebook: string;
    masterJournal: string;
    masterFeedback?: string;
  };
  messages: Message[];
  updatedAt: number;
  createdAt: number;
}

export interface StoryState {
  currentView: 'home' | 'story' | 'settings' | 'analytics';
  stories: Story[];
  activeStoryId: string | null;
  masterFeedback: string;
  
  // Settings
  llmProvider: 'openrouter' | 'gemini' | 'openai';
  llmUrl: string;
  llmKey: string;
  modelName: string;

  // Loading States
  isGeneratingStory: boolean;
  isUpdatingLorebook: boolean;
  isUpdatingJournal: boolean;
  
  // Actions
  setView: (view: 'home' | 'story' | 'settings' | 'analytics') => void;
  selectStory: (storyId: string) => void;
  createStory: (
    title: string,
    synopsis: string,
    characterName: string,
    genre: string,
    type?: 'tale' | 'template',
    lorebook?: string,
    characterSheet?: string,
    masterJournal?: string,
    language?: string,
    masterFeedback?: string
  ) => void;
  updateStory: (
    storyId: string,
    title: string,
    synopsis: string,
    characterName: string,
    lorebook: string,
    characterSheet?: string,
    masterJournal?: string,
    masterFeedback?: string
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
  updateLlmSettings: (provider: 'openrouter' | 'gemini' | 'openai', url: string, key: string, modelName: string) => void;
  importStore: (data: any) => void;
}
