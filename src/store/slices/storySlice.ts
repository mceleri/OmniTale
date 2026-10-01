import { StateCreator } from 'zustand';
import {
  Story,
  StoryState,
  Role,
  Message,
  NarrativePropensity,
  NarratorStyle,
  StorySections,
  CampaignStochasticMatrix,
  LoreBlock,
} from '../../types/story';
import { initialStories } from '../initialStories';
import { parseMarkdownToBlocks, compileBlocksToMarkdown } from '../../utils/markdownParser';
import { estimateTokens } from '../../utils/tokenEstimator';
import { orchestrateMasterResponse } from '../../services/storyOrchestratorService';
import { validateBackupPayload } from '../../utils/validation';

export interface StorySlice {
  stories: Story[];
  activeStoryId: string | null;
  masterFeedback: string;

  // Loading States
  isGeneratingStory: boolean;
  isUpdatingLorebook: boolean;
  isUpdatingJournal: boolean;

  // Actions
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
  importStore: (data: any) => void;
}

export const createStorySlice: StateCreator<
  StoryState,
  [],
  [],
  StorySlice
> = (set, get) => ({
  stories: initialStories,
  activeStoryId: null,
  masterFeedback: '',

  isGeneratingStory: false,
  isUpdatingLorebook: false,
  isUpdatingJournal: false,

  selectStory: (storyId: string) =>
    set((state: StoryState) => {
      let selectedStoryFeedback = '';
      const updatedStories = state.stories.map((s: Story) => {
        if (s.id === storyId) {
          selectedStoryFeedback = s.dynamicState.masterFeedback || '';
          return { ...s, updatedAt: Date.now() };
        }
        return s;
      });

      return {
        currentView: 'story',
        activeStoryId: storyId,
        masterFeedback: selectedStoryFeedback,
        stories: updatedStories,
      };
    }),

  createStory: (
    title: string,
    synopsis: string,
    characterName: string,
    genre: string,
    type: 'tale' | 'template' = 'tale',
    lorebook?: string,
    characterSheet?: string,
    masterJournal?: string,
    language?: string,
    masterFeedback?: string,
    narrativePropensity?: NarrativePropensity,
    sections?: StorySections,
    startingIntent?: string,
    stochasticMatrix?: CampaignStochasticMatrix
  ) =>
    set((state: StoryState) => {
      const newId = 'story_' + Date.now();
      const storyFeedback = masterFeedback !== undefined ? masterFeedback : '';
      const initialSetting =
        sections?.setting !== undefined
          ? sections.setting
          : lorebook !== undefined
          ? lorebook
          : `## The Journey Begins\n\nThis is the lorebook for your journey in "${title}". Record locations, characters, and rules here.`;
      const initialCharSheet =
        sections?.characterSheet !== undefined
          ? sections.characterSheet
          : characterSheet !== undefined
          ? characterSheet
          : `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`;
      const initialFactions = sections?.factions !== undefined ? sections.factions : '';
      const initialConflicts = sections?.conflicts !== undefined ? sections.conflicts : '';
      const initialHistoricalFacts = sections?.historicalFacts !== undefined ? sections.historicalFacts : '';
      const compiledLorebook = lorebook !== undefined ? lorebook : initialSetting;

      const newStory: Story = {
        id: newId,
        type,
        title,
        genre,
        synopsis,
        language,
        narrativePropensity: narrativePropensity || 'balanced',
        narratorStyle: (['cinematic', 'balanced', 'literary'].includes(narrativePropensity as string) ? narrativePropensity : 'balanced') as NarratorStyle,
        dynamicState: {
          characterSheet: initialCharSheet,
          lorebook: compiledLorebook,
          masterJournal:
            masterJournal !== undefined
              ? masterJournal
              : `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`,
          masterFeedback: storyFeedback,
          setting: initialSetting,
          factions: initialFactions,
          conflicts: initialConflicts,
          historicalFacts: initialHistoricalFacts,
          judgeScratchpad: [],
          startingIntent,
          defaultStartingIntent: startingIntent,
          stochasticMatrix,
        },
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedStories = [newStory, ...state.stories];

      if (type === 'template') {
        return {
          stories: updatedStories,
          currentView: 'home',
          activeStoryId: null,
        };
      }

      return {
        stories: updatedStories,
        currentView: 'story',
        activeStoryId: newId,
        masterFeedback: storyFeedback,
      };
    }),

  updateStory: (
    storyId: string,
    title: string,
    synopsis: string,
    _characterName: string,
    lorebook: string,
    characterSheet?: string,
    masterJournal?: string,
    masterFeedback?: string,
    narrativePropensity?: NarrativePropensity,
    sections?: StorySections,
    startingIntent?: string,
    stochasticMatrix?: CampaignStochasticMatrix
  ) =>
    set((state: StoryState) => {
      const updatedStories = state.stories.map((s: Story) => {
        if (s.id === storyId) {
          return {
            ...s,
            title,
            synopsis,
            ...(narrativePropensity !== undefined
              ? {
                  narrativePropensity,
                  narratorStyle: (['cinematic', 'balanced', 'literary'].includes(narrativePropensity)
                    ? narrativePropensity
                    : s.narratorStyle || 'balanced') as NarratorStyle,
                }
              : {}),
            dynamicState: {
              ...s.dynamicState,
              lorebook,
              characterSheet: characterSheet !== undefined ? characterSheet : s.dynamicState.characterSheet,
              masterJournal: masterJournal !== undefined ? masterJournal : s.dynamicState.masterJournal,
              masterFeedback: masterFeedback !== undefined ? masterFeedback : s.dynamicState.masterFeedback,
              setting: sections?.setting !== undefined ? sections.setting : s.dynamicState.setting,
              factions: sections?.factions !== undefined ? sections.factions : s.dynamicState.factions,
              conflicts: sections?.conflicts !== undefined ? sections.conflicts : s.dynamicState.conflicts,
              historicalFacts:
                sections?.historicalFacts !== undefined ? sections.historicalFacts : s.dynamicState.historicalFacts,
              startingIntent: startingIntent !== undefined ? startingIntent : s.dynamicState.startingIntent,
              stochasticMatrix:
                stochasticMatrix !== undefined ? stochasticMatrix : s.dynamicState.stochasticMatrix,
            },
            updatedAt: Date.now(),
          };
        }
        return s;
      });

      return {
        stories: updatedStories,
        ...(state.activeStoryId === storyId && masterFeedback !== undefined ? { masterFeedback } : {}),
      };
    }),

  setNarrativePropensity: (storyId: string, propensity: NarrativePropensity) =>
    set((state: StoryState) => {
      const updatedStories = state.stories.map((s: Story) => {
        if (s.id === storyId) {
          return {
            ...s,
            narrativePropensity: propensity,
            narratorStyle: (['cinematic', 'balanced', 'literary'].includes(propensity)
              ? propensity
              : s.narratorStyle || 'balanced') as NarratorStyle,
            updatedAt: Date.now(),
          };
        }
        return s;
      });

      return { stories: updatedStories };
    }),

  setNarratorStyle: (storyId: string, style: NarratorStyle) =>
    set((state: StoryState) => {
      const updatedStories = state.stories.map((s: Story) => {
        if (s.id === storyId) {
          return {
            ...s,
            narratorStyle: style,
            narrativePropensity: style,
            updatedAt: Date.now(),
          };
        }
        return s;
      });

      return { stories: updatedStories };
    }),

  deleteStory: (storyId: string) =>
    set((state: StoryState) => {
      const updatedStories = state.stories.filter((s: Story) => s.id !== storyId);
      const wasActive = state.activeStoryId === storyId;
      return {
        stories: updatedStories,
        ...(wasActive
          ? {
              activeStoryId: null,
              currentView: 'home',
            }
          : {}),
      };
    }),

  addMessage: (role: Role, content: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId) return {};

      const newMessage: Message = {
        id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
        role,
        content,
        tokens: estimateTokens(content),
      };

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          return {
            ...story,
            messages: [...story.messages, newMessage],
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  sendMessage: async (content: string) => {
    const state = get();
    if (state.isGeneratingStory) {
      console.warn('sendMessage ignored: generation already in progress.');
      return;
    }

    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory) return;

    const isStart = activeStory.messages.length === 0;
    const lastMsg = activeStory.messages[activeStory.messages.length - 1];
    const isPendingPlayerAction = Boolean(lastMsg && lastMsg.role === 'player');
    if (!content.trim() && !isStart && !isPendingPlayerAction) return;

    let updatedMessages = activeStory.messages;

    if (content.trim()) {
      const newPlayerMessage: Message = {
        id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
        role: 'player',
        content: content.trim(),
        tokens: estimateTokens(content.trim()),
      };

      updatedMessages = [...activeStory.messages, newPlayerMessage];

      set((s: StoryState) => {
        const updatedStories = s.stories.map((story: Story) => {
          if (story.id === s.activeStoryId) {
            return {
              ...story,
              messages: updatedMessages,
              updatedAt: Date.now(),
            };
          }
          return story;
        });
        return {
          stories: updatedStories,
        };
      });
    }

    await orchestrateMasterResponse({ getState: get, setState: set }, updatedMessages);
  },

  editLastPlayerMessage: async (newContent: string) => {
    const state = get();
    if (state.isGeneratingStory) {
      console.warn('editLastPlayerMessage ignored: generation already in progress.');
      return;
    }

    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory) return;

    const messages = [...activeStory.messages];
    const lastPlayerIdx = messages.map((m: Message) => m.role).lastIndexOf('player');
    if (lastPlayerIdx === -1) return;

    messages[lastPlayerIdx].content = newContent;
    messages[lastPlayerIdx].tokens = estimateTokens(newContent);

    // Identify any messages after lastPlayerIdx that are being discarded
    const discardedMessages = messages.slice(lastPlayerIdx + 1);
    const discardedNotes = new Set(discardedMessages.map((m: Message) => m.judgeNote).filter(Boolean));
    const currentScratchpad = activeStory.dynamicState.judgeScratchpad || [];
    const updatedScratchpad =
      discardedNotes.size > 0
        ? currentScratchpad.filter((note: string) => !discardedNotes.has(note))
        : currentScratchpad;

    const updatedMessages = messages.slice(0, lastPlayerIdx + 1);

    set((s: StoryState) => {
      const updatedStories = s.stories.map((story: Story) => {
        if (story.id === s.activeStoryId) {
          return {
            ...story,
            messages: updatedMessages,
            dynamicState: {
              ...story.dynamicState,
              judgeScratchpad: updatedScratchpad,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });
      return {
        stories: updatedStories,
      };
    });

    await orchestrateMasterResponse({ getState: get, setState: set }, updatedMessages);
  },

  deleteLastMessage: () =>
    set((state: StoryState) => {
      if (!state.activeStoryId || state.isGeneratingStory) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          if (story.messages.length === 0) return story;
          const lastMsg = story.messages[story.messages.length - 1];
          const updatedMessages = story.messages.slice(0, -1);

          let updatedScratchpad = [...(story.dynamicState.judgeScratchpad || [])];
          if (lastMsg.judgeNote) {
            const idx = updatedScratchpad.lastIndexOf(lastMsg.judgeNote);
            if (idx !== -1) {
              updatedScratchpad.splice(idx, 1);
            }
          }

          return {
            ...story,
            messages: updatedMessages,
            dynamicState: {
              ...story.dynamicState,
              judgeScratchpad: updatedScratchpad,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  deleteMessage: (messageId: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId || state.isGeneratingStory) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          const targetMsg = story.messages.find((m: Message) => m.id === messageId);
          if (!targetMsg) return story;

          const updatedMessages = story.messages.filter((m: Message) => m.id !== messageId);

          let updatedScratchpad = [...(story.dynamicState.judgeScratchpad || [])];
          if (targetMsg.judgeNote) {
            const idx = updatedScratchpad.lastIndexOf(targetMsg.judgeNote);
            if (idx !== -1) {
              updatedScratchpad.splice(idx, 1);
            }
          }

          return {
            ...story,
            messages: updatedMessages,
            dynamicState: {
              ...story.dynamicState,
              judgeScratchpad: updatedScratchpad,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  regenerateLastResponse: async () => {
    const state = get();
    if (state.isGeneratingStory) {
      console.warn('regenerateLastResponse ignored: generation already in progress.');
      return;
    }

    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory || activeStory.messages.length === 0) return;

    const lastMsg = activeStory.messages[activeStory.messages.length - 1];
    let messagesForGen = activeStory.messages;

    if (lastMsg.role !== 'player') {
      const prunedMessages = activeStory.messages.slice(0, -1);
      let updatedScratchpad = [...(activeStory.dynamicState.judgeScratchpad || [])];
      if (lastMsg.judgeNote) {
        const idx = updatedScratchpad.lastIndexOf(lastMsg.judgeNote);
        if (idx !== -1) {
          updatedScratchpad.splice(idx, 1);
        }
      }
      set((s: StoryState) => {
        const updatedStories = s.stories.map((story: Story) => {
          if (story.id === s.activeStoryId) {
            return {
              ...story,
              messages: prunedMessages,
              dynamicState: {
                ...story.dynamicState,
                judgeScratchpad: updatedScratchpad,
              },
              updatedAt: Date.now(),
            };
          }
          return story;
        });
        return { stories: updatedStories };
      });
      messagesForGen = prunedMessages;
    }

    await orchestrateMasterResponse({ getState: get, setState: set }, messagesForGen);
  },

  updateCharacterSheet: (text: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          return {
            ...story,
            dynamicState: {
              ...story.dynamicState,
              characterSheet: text,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  updateMasterJournal: (text: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          return {
            ...story,
            dynamicState: {
              ...story.dynamicState,
              masterJournal: text,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  updateMasterFeedback: (text: string) =>
    set((state: StoryState) => {
      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          return {
            ...story,
            dynamicState: {
              ...story.dynamicState,
              masterFeedback: text,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        masterFeedback: text,
        stories: updatedStories,
      };
    }),

  addLoreItem: (title: string, content: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          const currentLorebook = story.dynamicState.lorebook || '';
          const blocks = parseMarkdownToBlocks(currentLorebook);

          const filteredBlocks = blocks.filter((b) => b.title.toLowerCase() !== title.toLowerCase());
          const newBlock: LoreBlock = {
            id: 'lore_' + Date.now() + Math.random().toString(36).substring(2, 6),
            title,
            content,
          };

          const updatedLorebook = compileBlocksToMarkdown([...filteredBlocks, newBlock]);

          return {
            ...story,
            dynamicState: {
              ...story.dynamicState,
              lorebook: updatedLorebook,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  deleteLoreItem: (itemId: string) =>
    set((state: StoryState) => {
      if (!state.activeStoryId) return {};

      const updatedStories = state.stories.map((story: Story) => {
        if (story.id === state.activeStoryId) {
          const currentLorebook = story.dynamicState.lorebook || '';
          const blocks = parseMarkdownToBlocks(currentLorebook);
          const filteredBlocks = blocks.filter((b) => b.id !== itemId && b.title.toLowerCase() !== itemId.toLowerCase());

          const updatedLorebook = compileBlocksToMarkdown(filteredBlocks);

          return {
            ...story,
            dynamicState: {
              ...story.dynamicState,
              lorebook: updatedLorebook,
            },
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
      };
    }),

  importStore: (data: any) =>
    set(() => {
      const result = validateBackupPayload(data);
      if (!result.isValid || !result.data) {
        console.error('Import failed:', result.error);
        return {};
      }

      return {
        stories: result.data.stories,
        activeStoryId: result.data.activeStoryId,
        currentView: result.data.currentView || 'story',
        masterFeedback: result.data.masterFeedback || '',
      };
    }),
});
