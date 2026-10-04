export interface LoreBlock {
  id: string;
  title: string;
  content: string;
}

export type Role = 'master' | 'player' | 'system_feedback';

export type NarratorStyle = 'cinematic' | 'balanced' | 'literary';

export type NarrativePropensity = NarratorStyle | 'character_driven' | 'plot_driven';

export type FateTier = 'very_unfavorable' | 'unfavorable' | 'neutral' | 'favorable' | 'very_favorable';

export interface FateOracleRoll {
  value: number; // 1-100
  tier: FateTier;
  label: string;
  narrativeDirective: string;
}

export interface StochasticDimension {
  value: number; // 1-100
  tier: FateTier;
  label: string;
  guidance: string;
}

export interface CampaignStochasticMatrix {
  environment: StochasticDimension;
  socialClimate: StochasticDimension;
  resources: StochasticDimension;
  entourage: StochasticDimension;
  catalyst: StochasticDimension;
}

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

export interface StageTokens {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  tokens?: number;
  promptTokens?: number;
  judgeNote?: string;
  debugResolution?: TurnResolution;
  fateRoll?: FateOracleRoll;
  stochasticMatrix?: CampaignStochasticMatrix;
  judgeTokens?: StageTokens;
  narratorTokens?: StageTokens;
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
  narratorStyle?: NarratorStyle;
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
    stochasticMatrix?: CampaignStochasticMatrix;
    defaultStartingIntent?: string;
    startingIntent?: string;
    defaultStochasticMatrix?: CampaignStochasticMatrix | null;
  };
  messages: Message[];
  updatedAt: number;
  createdAt: number;
}

export type LLMProvider = 'local' | 'openrouter' | 'gemini';

export interface StoryState {
  currentView: 'home' | 'story' | 'settings' | 'analytics';
  stories: Story[];
  activeStoryId: string | null;
  masterFeedback: string;
  
  // Settings
  llmProvider: LLMProvider;
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
    masterFeedback?: string,
    narrativePropensity?: NarrativePropensity,
    sections?: StorySections,
    startingIntent?: string,
    stochasticMatrix?: CampaignStochasticMatrix
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
    sections?: StorySections,
    startingIntent?: string,
    stochasticMatrix?: CampaignStochasticMatrix
  ) => void;
  setNarrativePropensity: (storyId: string, propensity: NarrativePropensity) => void;
  setNarratorStyle: (storyId: string, style: NarratorStyle) => void;
  deleteStory: (storyId: string) => void;
  addMessage: (role: Role, content: string) => void;
  sendMessage: (content: string) => Promise<void>;
  editLastPlayerMessage: (newContent: string) => Promise<void>;
  deleteLastMessage: () => void;
  deleteMessage: (messageId: string) => void;
  regenerateLastResponse: () => Promise<void>;
  updateCharacterSheet: (text: string) => void;
  updateMasterJournal: (text: string) => void;
  updateMasterFeedback: (text: string) => void;
  addLoreItem: (title: string, content: string) => void;
  deleteLoreItem: (itemId: string) => void;
  updateLlmSettings: (provider: LLMProvider, url: string, key: string, modelName: string) => void;
  importStore: (data: any) => void;
}
