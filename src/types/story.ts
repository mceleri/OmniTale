import { LoreBlock } from '../utils/markdownParser';

export type Role = 'master' | 'player' | 'system_feedback';

export type NarrativePropensity = 'character_driven' | 'balanced' | 'plot_driven';

export interface TurnResolution {
  actionOutcome: 'success' | 'partial' | 'failure' | 'neutral';
  difficultyNote?: string;
  npcReactions: Array<{
    npcName: string;
    action: string;
    isProactive: boolean;
  }>;
  factionEcho?: string;
  pacingSuggestion: 'escalate' | 'downtime' | 'maintain';
  newHookOrTwist?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  tokens?: number;
  promptTokens?: number;
  judgeNote?: string;
  debugResolution?: TurnResolution;
}

export type LoreItem = LoreBlock;

export interface StorySections {
  setting?: string;
  characterSheet?: string;
  factions?: string;
  conflicts?: string;
  historicalFacts?: string;
}

export interface Story {
  id: string;
  type: 'tale' | 'template';
  title: string;
  genre: string;
  synopsis: string;
  language?: string;
  narrativePropensity?: NarrativePropensity;
  dynamicState: {
    characterSheet: string;
    lorebook: string;
    masterJournal: string;
    masterFeedback?: string;
    setting?: string;
    factions?: string;
    conflicts?: string;
    historicalFacts?: string;
    judgeScratchpad?: string[];
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
  useAgenticPipeline: boolean;

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
    masterFeedback?: string,
    narrativePropensity?: NarrativePropensity,
    sections?: StorySections
  ) => void;
  updateStory: (
    storyId: string,
    title: string,
    synopsis: string,
    characterName: string,
    lorebook: string,
    characterSheet?: string,
    masterJournal?: string,
    masterFeedback?: string,
    narrativePropensity?: NarrativePropensity,
    sections?: StorySections
  ) => void;
  setNarrativePropensity: (storyId: string, propensity: NarrativePropensity) => void;
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
  updateLlmSettings: (provider: 'openrouter' | 'gemini' | 'openai', url: string, key: string, modelName: string, useAgenticPipeline?: boolean) => void;
  setUseAgenticPipeline: (enabled: boolean) => void;
  importStore: (data: any) => void;
}
