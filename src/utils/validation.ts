import { Story, Message } from '../types/story';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

export interface BackupPayload {
  stories: Story[];
  currentView?: 'home' | 'story' | 'settings' | 'analytics';
  activeStoryId?: string | null;
  masterFeedback?: string;
  messages?: Message[];
  characterSheet?: string;
  lorebook?: string;
  masterJournal?: string;
}

/**
 * Validates a single story object.
 */
export const isValidStory = (item: any): item is Story => {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.id !== 'string' || !item.id.trim()) return false;
  if (typeof item.title !== 'string') return false;
  if (typeof item.synopsis !== 'string') return false;
  if (typeof item.genre !== 'string') return false;
  if (!item.dynamicState || typeof item.dynamicState !== 'object') return false;
  if (typeof item.dynamicState.characterSheet !== 'string') return false;
  if (typeof item.dynamicState.lorebook !== 'string') return false;
  if (typeof item.dynamicState.masterJournal !== 'string') return false;
  if (!Array.isArray(item.messages)) return false;

  return true;
};

/**
 * Sanitizes and cleans a story object to guarantee required dynamicState shape.
 */
export const sanitizeStory = (story: any): Story => {
  const dynamicState = story.dynamicState || {};
  return {
    id: String(story.id),
    type: story.type === 'template' ? 'template' : 'tale',
    title: String(story.title || 'Untitled Story'),
    genre: String(story.genre || 'Custom'),
    synopsis: String(story.synopsis || ''),
    language: story.language ? String(story.language) : undefined,
    narrativePropensity: story.narrativePropensity || story.narratorStyle || 'balanced',
    narratorStyle: story.narratorStyle || (['cinematic', 'balanced', 'literary'].includes(story.narrativePropensity) ? story.narrativePropensity : 'balanced'),
    dynamicState: {
      characterSheet: String(dynamicState.characterSheet || ''),
      lorebook: String(dynamicState.lorebook || ''),
      masterJournal: String(dynamicState.masterJournal || ''),
      masterFeedback: typeof dynamicState.masterFeedback === 'string' ? dynamicState.masterFeedback : '',
      setting: typeof dynamicState.setting === 'string' ? dynamicState.setting : undefined,
      factions: typeof dynamicState.factions === 'string' ? dynamicState.factions : undefined,
      conflicts: typeof dynamicState.conflicts === 'string' ? dynamicState.conflicts : undefined,
      historicalFacts: typeof dynamicState.historicalFacts === 'string' ? dynamicState.historicalFacts : undefined,
      judgeScratchpad: Array.isArray(dynamicState.judgeScratchpad) ? dynamicState.judgeScratchpad : [],
      stochasticMatrix: dynamicState.stochasticMatrix || undefined,
      startingIntent: typeof dynamicState.startingIntent === 'string' ? dynamicState.startingIntent : undefined,
      defaultStartingIntent: typeof dynamicState.defaultStartingIntent === 'string' ? dynamicState.defaultStartingIntent : undefined,
      defaultStochasticMatrix: dynamicState.defaultStochasticMatrix || null,
    },
    messages: Array.isArray(story.messages)
      ? story.messages.filter((m: any) => m && typeof m.content === 'string' && typeof m.role === 'string')
      : [],
    updatedAt: typeof story.updatedAt === 'number' ? story.updatedAt : Date.now(),
    createdAt: typeof story.createdAt === 'number' ? story.createdAt : Date.now(),
  };
};

/**
 * Validates an entire import backup payload and filters out corrupted nodes.
 */
export const validateBackupPayload = (raw: unknown): ValidationResult<BackupPayload> => {
  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      error: 'Invalid file payload: Expected a JSON object.',
    };
  }

  const obj = raw as Record<string, any>;
  if (!Array.isArray(obj.stories)) {
    return {
      isValid: false,
      error: 'Invalid backup structure: Missing "stories" array.',
    };
  }

  const validStories: Story[] = [];
  for (const item of obj.stories) {
    if (isValidStory(item)) {
      validStories.push(sanitizeStory(item));
    }
  }

  if (validStories.length === 0) {
    return {
      isValid: false,
      error: 'No valid stories found in the backup file.',
    };
  }

  return {
    isValid: true,
    data: {
      stories: validStories,
      currentView: 'story',
      activeStoryId: validStories[0].id,
      masterFeedback: typeof obj.masterFeedback === 'string' ? obj.masterFeedback : '',
    },
  };
};
