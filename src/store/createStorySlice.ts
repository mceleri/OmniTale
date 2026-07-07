import { StateCreator } from 'zustand';
import { Story, StoryState, Role, Message } from '../types/story';
import { initialStories } from './initialStories';
import { parseMarkdownToBlocks, compileBlocksToMarkdown, LoreBlock } from '../utils/markdownParser';
import { fetchNarrative } from '../services/llmService';
import { executeBackgroundUpdates } from '../services/backgroundService';
import { formatUnifiedPrompt } from '../utils/prompts/storyPrompts';

export interface StorySlice {
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

export const createStorySlice: StateCreator<
  StoryState,
  [],
  [],
  StorySlice
> = (set, get) => ({
  currentView: 'home' as 'home' | 'story' | 'settings',
  stories: initialStories,
  activeStoryId: null as string | null,
  masterFeedback: 'Keep the atmosphere dark, descriptive, and mysterious. Emphasize sensory details like damp air, ancient moss, and hums.',

  llmUrl: '',
  llmKey: '',
  modelName: '',

  isGeneratingStory: false,
  isUpdatingLorebook: false,
  isUpdatingJournal: false,

  setView: (view: 'home' | 'story' | 'settings') => set({ currentView: view }),

  selectStory: (storyId: string) => set((state: StoryState) => {
    const updatedStories = state.stories.map((s: Story) => {
      if (s.id === storyId) {
        return { ...s, updatedAt: Date.now() };
      }
      return s;
    });

    return {
      currentView: 'story',
      activeStoryId: storyId,
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
    masterJournal?: string
  ) => set((state: StoryState) => {
    const newId = 'story_' + Date.now();
    const newStory: Story = {
      id: newId,
      type,
      title,
      genre,
      synopsis,
      dynamicState: {
        characterSheet: characterSheet !== undefined ? characterSheet : `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`,
        lorebook: lorebook !== undefined ? lorebook : `## The Journey Begins\n\nThis is the lorebook for your journey in "${title}". Record locations, characters, and rules here.`,
        masterJournal: masterJournal !== undefined ? masterJournal : `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`,
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
    };
  }),

  updateStory: (
    storyId: string,
    title: string,
    synopsis: string,
    _characterName: string,
    lorebook: string,
    characterSheet?: string,
    masterJournal?: string
  ) => set((state: StoryState) => {
    const updatedStories = state.stories.map((s: Story) => {
      if (s.id === storyId) {
        return {
          ...s,
          title,
          synopsis,
          dynamicState: {
            ...s.dynamicState,
            lorebook,
            characterSheet: characterSheet !== undefined ? characterSheet : s.dynamicState.characterSheet,
            masterJournal: masterJournal !== undefined ? masterJournal : s.dynamicState.masterJournal,
          },
          updatedAt: Date.now(),
        };
      }
      return s;
    });

    return {
      stories: updatedStories,
    };
  }),

  deleteStory: (storyId: string) => set((state: StoryState) => {
    const updatedStories = state.stories.filter((s: Story) => s.id !== storyId);
    const wasActive = state.activeStoryId === storyId;
    return {
      stories: updatedStories,
      ...(wasActive ? {
        activeStoryId: null,
        currentView: 'home',
      } : {}),
    };
  }),

  addMessage: (role: Role, content: string) => set((state: StoryState) => {
    if (!state.activeStoryId) return {};

    const newMessage: Message = {
      id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
      role,
      content,
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
    const state = get() as StoryState;
    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory) return;

    const isStart = activeStory.messages.length === 0;
    if (!content.trim() && !isStart) return;

    let updatedMessages = activeStory.messages;

    if (content.trim()) {
      const newPlayerMessage: Message = {
        id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
        role: 'player',
        content: content.trim(),
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

    await generateMasterResponse(set, get, updatedMessages);
  },

  editLastPlayerMessage: async (newContent: string) => {
    const state = get() as StoryState;
    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory) return;

    const messages = [...activeStory.messages];
    const lastPlayerIdx = messages.map((m: Message) => m.role).lastIndexOf('player');
    if (lastPlayerIdx === -1) return;

    messages[lastPlayerIdx].content = newContent;
    const updatedMessages = messages.slice(0, lastPlayerIdx + 1);

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

    await generateMasterResponse(set, get, updatedMessages);
  },

  deleteLastMessage: () => set((state: StoryState) => {
    if (!state.activeStoryId) return {};

    const updatedStories = state.stories.map((story: Story) => {
      if (story.id === state.activeStoryId) {
        if (story.messages.length === 0) return story;
        return {
          ...story,
          messages: story.messages.slice(0, -1),
          updatedAt: Date.now(),
        };
      }
      return story;
    });

    return {
      stories: updatedStories,
    };
  }),

  updateCharacterSheet: (text: string) => set((state: StoryState) => {
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

  updateMasterJournal: (text: string) => set((state: StoryState) => {
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

  updateMasterFeedback: (text: string) => set(() => {
    return {
      masterFeedback: text,
    };
  }),

  addLoreItem: (title: string, content: string) => set((state: StoryState) => {
    if (!state.activeStoryId) return {};

    const updatedStories = state.stories.map((story: Story) => {
      if (story.id === state.activeStoryId) {
        const currentLorebook = story.dynamicState.lorebook || '';
        const blocks = parseMarkdownToBlocks(currentLorebook);
        
        const filteredBlocks = blocks.filter((b) => b.title.toLowerCase() !== title.toLowerCase());
        const newBlock: LoreBlock = {
          id: 'lore_' + Date.now(),
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

  deleteLoreItem: (itemId: string) => set((state: StoryState) => {
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

  updateLlmSettings: (url: string, key: string, modelName: string) => set(() => {
    return { llmUrl: url, llmKey: key, modelName: modelName };
  }),

  importStore: (data: any) => set((state: StoryState) => {
    // Validate shape of loaded backup data before importing
    const importedStories = Array.isArray(data.stories) ? data.stories.filter((story: any) => {
      return (
        typeof story.id === 'string' &&
        typeof story.title === 'string' &&
        typeof story.synopsis === 'string' &&
        story.dynamicState &&
        typeof story.dynamicState.lorebook === 'string'
      );
    }) : [];

    return {
      currentView: (data.currentView === 'home' || data.currentView === 'story' || data.currentView === 'settings') ? data.currentView : 'home',
      stories: importedStories.length > 0 ? importedStories : state.stories,
      activeStoryId: typeof data.activeStoryId === 'string' ? data.activeStoryId : null,
      masterFeedback: typeof data.masterFeedback === 'string' ? data.masterFeedback : state.masterFeedback,
      llmUrl: state.llmUrl,
      llmKey: state.llmKey,
      modelName: state.modelName,
    };
  }),
});

const generateMasterResponse = async (
  set: any,
  get: any,
  updatedMessages: Message[]
) => {
  set({ isGeneratingStory: true });
  
  const state = get() as StoryState;
  const activeStory = state.stories.find((s) => s.id === state.activeStoryId);
  if (!activeStory) {
    set({ isGeneratingStory: false });
    return;
  }

  const url = state.llmUrl;
  const key = state.llmKey;
  const model = state.modelName;
  const lore = activeStory.dynamicState.lorebook;
  const charSheet = activeStory.dynamicState.characterSheet;
  const journal = activeStory.dynamicState.masterJournal;
  const feedback = state.masterFeedback || '';

  const UNIFIED_PROMPT = formatUnifiedPrompt(lore, charSheet, journal, feedback);

  try {
    const last10Messages = updatedMessages.slice(-10);
    const masterResponseText = await fetchNarrative(url, key, model, UNIFIED_PROMPT, last10Messages);

    const masterMessage: Message = {
      id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
      role: 'master',
      content: masterResponseText,
    };

    const finalMessages = [...updatedMessages, masterMessage];

    set((s: StoryState) => {
      const updatedStories = s.stories.map((story: Story) => {
        if (story.id === s.activeStoryId) {
          return {
            ...story,
            messages: finalMessages,
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
        isGeneratingStory: false,
      };
    });

    // Check count for background updates
    const masterMessagesCount = finalMessages.filter((m: Message) => m.role === 'master').length;
    if (masterMessagesCount > 0 && masterMessagesCount % 5 === 0) {
      await executeBackgroundUpdates(
        url,
        key,
        model,
        lore,
        journal,
        finalMessages.slice(-10),
        () => set({ isUpdatingLorebook: true }),
        (response) => set((state: StoryState) => {
          const updatedStories = state.stories.map((s) => {
            if (s.id === state.activeStoryId) {
              return {
                ...s,
                dynamicState: {
                  ...s.dynamicState,
                  lorebook: response,
                },
              };
            }
            return s;
          });
          return { stories: updatedStories };
        }),
        () => set({ isUpdatingLorebook: false }),
        () => set({ isUpdatingJournal: true }),
        (response) => set((state: StoryState) => {
          const updatedStories = state.stories.map((s) => {
            if (s.id === state.activeStoryId) {
              return {
                ...s,
                dynamicState: {
                  ...s.dynamicState,
                  masterJournal: response,
                },
              };
            }
            return s;
          });
          return { stories: updatedStories };
        }),
        () => set({ isUpdatingJournal: false })
      );
    }
  } catch (error: any) {
    console.error('Narrative generation error:', error);
    const errorMsg: Message = {
      id: 'msg_err_' + Date.now(),
      role: 'system_feedback',
      content: error?.message?.includes('API Key is missing')
        ? error.message
        : `Error connecting to AI GM: ${error?.message || error}. Please check your connection or LLM settings in the top-right / settings menu.`,
    };
    
    set((s: StoryState) => {
      const finalMessages = [...updatedMessages, errorMsg];
      const updatedStories = s.stories.map((story: Story) => {
        if (story.id === s.activeStoryId) {
          return {
            ...story,
            messages: finalMessages,
            updatedAt: Date.now(),
          };
        }
        return story;
      });

      return {
        stories: updatedStories,
        isGeneratingStory: false,
      };
    });
  }
};
