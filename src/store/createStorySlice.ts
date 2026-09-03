import { StateCreator } from 'zustand';
import { Story, StoryState, Role, Message, TurnResolution } from '../types/story';
import { initialStories } from './initialStories';
import { parseMarkdownToBlocks, compileBlocksToMarkdown, LoreBlock } from '../utils/markdownParser';
import { fetchNarrative, cleanAndParseJson } from '../services/llmService';
import { executeBackgroundUpdates } from '../services/backgroundService';
import {
  formatUnifiedPrompt,
  getInitialJournalGenerationPrompt,
  getJudgePrompt,
  getNarratorFromResolutionPrompt
} from '../utils/prompts/storyPrompts';
import { estimateTokens } from '../utils/tokenEstimator';

export interface StorySlice {
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
  updateLlmSettings: (provider: 'openrouter' | 'gemini' | 'openai', url: string, key: string, modelName: string, useAgenticPipeline?: boolean) => void;
  setUseAgenticPipeline: (enabled: boolean) => void;
  importStore: (data: any) => void;
}

export const createStorySlice: StateCreator<
  StoryState,
  [],
  [],
  StorySlice
> = (set, get) => ({
  currentView: 'home' as 'home' | 'story' | 'settings' | 'analytics',
  stories: initialStories,
  activeStoryId: null as string | null,
  masterFeedback: '',

  llmProvider: (import.meta.env.VITE_LLM_URL?.includes('generativelanguage') || import.meta.env.VITE_MODEL_NAME?.toLowerCase().startsWith('gemini'))
    ? 'gemini'
    : 'openrouter' as 'openrouter' | 'gemini' | 'openai',
  llmUrl: import.meta.env.VITE_LLM_URL || 'https://openrouter.ai/api/v1/chat/completions',
  llmKey: import.meta.env.VITE_LLM_KEY || '',
  modelName: import.meta.env.VITE_MODEL_NAME || 'google/gemma-2-9b-it:free',
  useAgenticPipeline: false,

  isGeneratingStory: false,
  isUpdatingLorebook: false,
  isUpdatingJournal: false,

  setUseAgenticPipeline: (enabled: boolean) => set({ useAgenticPipeline: enabled }),

  setView: (view: 'home' | 'story' | 'settings' | 'analytics') => set({ currentView: view }),

  selectStory: (storyId: string) => set((state: StoryState) => {
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
    masterFeedback?: string
  ) => set((state: StoryState) => {
    const newId = 'story_' + Date.now();
    const storyFeedback = masterFeedback !== undefined ? masterFeedback : '';
    const newStory: Story = {
      id: newId,
      type,
      title,
      genre,
      synopsis,
      language,
      dynamicState: {
        characterSheet: characterSheet !== undefined ? characterSheet : `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`,
        lorebook: lorebook !== undefined ? lorebook : `## The Journey Begins\n\nThis is the lorebook for your journey in "${title}". Record locations, characters, and rules here.`,
        masterJournal: masterJournal !== undefined ? masterJournal : `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`,
        masterFeedback: storyFeedback,
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
    masterFeedback?: string
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
            masterFeedback: masterFeedback !== undefined ? masterFeedback : s.dynamicState.masterFeedback,
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
    const state = get() as StoryState;
    if (state.isGeneratingStory) {
      console.warn("sendMessage ignored: generation already in progress.");
      return;
    }

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

    await generateMasterResponse(set, get, updatedMessages);
  },

  editLastPlayerMessage: async (newContent: string) => {
    const state = get() as StoryState;
    if (state.isGeneratingStory) {
      console.warn("editLastPlayerMessage ignored: generation already in progress.");
      return;
    }

    const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
    if (!activeStory) return;

    const messages = [...activeStory.messages];
    const lastPlayerIdx = messages.map((m: Message) => m.role).lastIndexOf('player');
    if (lastPlayerIdx === -1) return;

    messages[lastPlayerIdx].content = newContent;
    messages[lastPlayerIdx].tokens = estimateTokens(newContent);
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

  updateMasterFeedback: (text: string) => set((state: StoryState) => {
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

  updateLlmSettings: (provider: 'openrouter' | 'gemini' | 'openai', url: string, key: string, modelName: string, useAgenticPipeline?: boolean) => set((state: StoryState) => {
    return {
      llmProvider: provider,
      llmUrl: url,
      llmKey: key,
      modelName: modelName,
      useAgenticPipeline: useAgenticPipeline !== undefined ? useAgenticPipeline : state.useAgenticPipeline,
    };
  }),

  importStore: (data: any) => set((state: StoryState) => {
    // Validate shape of loaded backup data before importing
    const importedStories = Array.isArray(data.stories) ? data.stories.filter((story: any) => {
      return (
        typeof story.id === 'string' &&
        typeof story.title === 'string' &&
        typeof story.synopsis === 'string' &&
        typeof story.genre === 'string' &&
        story.dynamicState &&
        typeof story.dynamicState.characterSheet === 'string' &&
        typeof story.dynamicState.lorebook === 'string' &&
        typeof story.dynamicState.masterJournal === 'string' &&
        Array.isArray(story.messages)
      );
    }) : [];

    if (importedStories.length === 0) {
      alert('Import failed: The file did not contain any valid OmniTale stories.');
      return {};
    }

    const firstStoryId = importedStories[0].id;
    return {
      stories: importedStories,
      activeStoryId: firstStoryId,
      currentView: 'story',
      masterFeedback: typeof data.masterFeedback === 'string' ? data.masterFeedback : '',
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
  const activeStory = state.stories.find((s: Story) => s.id === state.activeStoryId);
  if (!activeStory || !state.activeStoryId) {
    set({ isGeneratingStory: false });
    return;
  }

  const provider = state.llmProvider || 'openrouter';
  const url = state.llmUrl;
  const key = state.llmKey;
  const model = state.modelName;
  const useAgenticPipeline = Boolean(state.useAgenticPipeline);
  const lore = activeStory.dynamicState.lorebook;
  const charSheet = activeStory.dynamicState.characterSheet;
  const feedback = activeStory.dynamicState.masterFeedback !== undefined
    ? activeStory.dynamicState.masterFeedback
    : (state.masterFeedback || '');

  const isStart = updatedMessages.length === 0;
  let journal = activeStory.dynamicState.masterJournal;

  if (isStart) {
    set({ isUpdatingJournal: true });
    try {
      const journalPrompt = getInitialJournalGenerationPrompt(
        activeStory.title,
        activeStory.synopsis,
        activeStory.genre,
        charSheet,
        activeStory.language
      );
      
      console.log("[generateMasterResponse] Generating initial secret Master Journal...");
      const generatedJournal = await fetchNarrative(
        provider,
        url,
        key,
        model,
        journalPrompt,
        []
      );

      if (generatedJournal && generatedJournal.trim()) {
        journal = generatedJournal.trim();
        
        // Update the master journal in store state
        set((s: StoryState) => {
          const updatedStories = s.stories.map((story: Story) => {
            if (story.id === s.activeStoryId) {
              return {
                ...story,
                dynamicState: {
                  ...story.dynamicState,
                  masterJournal: journal,
                },
                updatedAt: Date.now(),
              };
            }
            return story;
          });
          return { stories: updatedStories };
        });
      }
    } catch (journalError) {
      console.error("Error generating initial master journal, proceeding with default:", journalError);
    } finally {
      set({ isUpdatingJournal: false });
    }
  }

  try {
    const last10Messages = updatedMessages.slice(-10);
    let masterResponseText = '';
    let apiPromptTokens = 0;
    let apiCompletionTokens = 0;
    let debugResolution: TurnResolution | undefined = undefined;

    if (useAgenticPipeline && !isStart) {
      console.log("[generateMasterResponse] Executing Agentic 2-Step Pipeline (Judge -> Narrator)...");
      try {
        // Step A: Judge / Reaction Prompt
        const judgePrompt = getJudgePrompt(lore, charSheet, journal, feedback, activeStory.language);
        let judgePromptTokens = 0;
        let judgeCompletionTokens = 0;

        const rawJudgeResponse = await fetchNarrative(
          provider,
          url,
          key,
          model,
          judgePrompt,
          last10Messages,
          (usage) => {
            judgePromptTokens = usage.prompt_tokens;
            judgeCompletionTokens = usage.completion_tokens;
          }
        );

        console.log("[generateMasterResponse] Step A Judge Raw Output:", rawJudgeResponse);
        const parsedResolution = cleanAndParseJson<TurnResolution>(rawJudgeResponse);

        if (parsedResolution && parsedResolution.actionOutcome && Array.isArray(parsedResolution.npcReactions)) {
          console.log("[generateMasterResponse] Step A Judge Resolution Parsed:", parsedResolution);
          debugResolution = parsedResolution;

          // Step B: Narrator Prompt based on pre-determined Turn Resolution
          const narratorPrompt = getNarratorFromResolutionPrompt(
            lore,
            charSheet,
            journal,
            feedback,
            parsedResolution,
            activeStory.language
          );

          let narratorPromptTokens = 0;
          let narratorCompletionTokens = 0;

          masterResponseText = await fetchNarrative(
            provider,
            url,
            key,
            model,
            narratorPrompt,
            last10Messages,
            (usage) => {
              narratorPromptTokens = usage.prompt_tokens;
              narratorCompletionTokens = usage.completion_tokens;
            }
          );

          apiPromptTokens = judgePromptTokens + narratorPromptTokens;
          apiCompletionTokens = judgeCompletionTokens + narratorCompletionTokens;
        } else {
          console.warn("[generateMasterResponse] Step A parsing failed or invalid format. Gracefully falling back to unified prompt...");
          const UNIFIED_PROMPT = formatUnifiedPrompt(lore, charSheet, journal, feedback, activeStory.language);
          masterResponseText = await fetchNarrative(
            provider,
            url,
            key,
            model,
            UNIFIED_PROMPT,
            last10Messages,
            (usage) => {
              apiPromptTokens = usage.prompt_tokens;
              apiCompletionTokens = usage.completion_tokens;
            }
          );
        }
      } catch (pipelineErr) {
        console.error("[generateMasterResponse] Error in agentic pipeline, falling back to unified prompt:", pipelineErr);
        const UNIFIED_PROMPT = formatUnifiedPrompt(lore, charSheet, journal, feedback, activeStory.language);
        masterResponseText = await fetchNarrative(
          provider,
          url,
          key,
          model,
          UNIFIED_PROMPT,
          last10Messages,
          (usage) => {
            apiPromptTokens = usage.prompt_tokens;
            apiCompletionTokens = usage.completion_tokens;
          }
        );
      }
    } else {
      // Classic single-call mode (or isStart)
      const UNIFIED_PROMPT = formatUnifiedPrompt(lore, charSheet, journal, feedback, activeStory.language);
      masterResponseText = await fetchNarrative(
        provider,
        url,
        key,
        model,
        UNIFIED_PROMPT,
        last10Messages,
        (usage) => {
          apiPromptTokens = usage.prompt_tokens;
          apiCompletionTokens = usage.completion_tokens;
        }
      );
    }

    const masterMessage: Message = {
      id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
      role: 'master',
      content: masterResponseText,
      tokens: apiCompletionTokens || estimateTokens(masterResponseText),
      promptTokens: apiPromptTokens || undefined,
      debugResolution,
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
        provider,
        url,
        key,
        model,
        lore,
        journal,
        finalMessages.slice(-25),
        activeStory.language,
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
