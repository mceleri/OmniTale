import { Story, StoryState, Message, FateOracleRoll, CampaignStochasticMatrix } from '../types/story';
import { fetchNarrative } from './llmService';
import { executeBackgroundUpdates } from './backgroundService';
import {
  formatUnifiedPrompt,
  getInitialJournalGenerationPrompt,
  getJudgePrompt,
  getNarratorPrompt,
  getTurnZeroPrompt,
  PromptSections,
} from '../utils/prompts/storyPrompts';
import { estimateTokens } from '../utils/tokenEstimator';
import { rollFateOracle, rollCampaignStochasticMatrix, formatStochasticMatrixPrompt } from '../utils/diceUtils';

export interface StoryStoreAccess {
  getState: () => StoryState;
  setState: (fn: ((state: StoryState) => Partial<StoryState>) | Partial<StoryState>) => void;
}

/**
 * Orchestrates the full AI Master narrative generation cycle, including
 * turn 0 initialization, fate oracle rolling, agentic pipeline resolution,
 * streaming prose updates, and background lore/journal sweeps.
 */
export const orchestrateMasterResponse = async (
  store: StoryStoreAccess,
  updatedMessages: Message[]
): Promise<void> => {
  const { getState, setState } = store;
  setState({ isGeneratingStory: true });

  const state = getState();
  const targetStoryId = state.activeStoryId;
  const activeStory = state.stories.find((s: Story) => s.id === targetStoryId);

  if (!activeStory || !targetStoryId) {
    setState({ isGeneratingStory: false });
    return;
  }

  const provider = state.llmProvider || 'openrouter';
  const url = state.llmUrl;
  const key = state.llmKey;
  const model = state.modelName;
  const lore = activeStory.dynamicState.lorebook;
  const charSheet = activeStory.dynamicState.characterSheet;
  const feedback = activeStory.dynamicState.masterFeedback !== undefined
    ? activeStory.dynamicState.masterFeedback
    : (state.masterFeedback || '');

  const isStart = updatedMessages.length === 0;
  let journal = activeStory.dynamicState.masterJournal;
  let stochasticMatrix: CampaignStochasticMatrix | undefined = undefined;

  // Check if the master journal is pre-authored
  const isJournalPreAuthored = journal && (
    journal.includes('[STARTING SCENARIO]') ||
    journal.includes('[CORE CAMPAIGN DIRECTIVES') ||
    journal.includes('[CORE CONFLICT HOOKS') ||
    journal.length > 250
  );

  if (isStart) {
    stochasticMatrix = activeStory.dynamicState.stochasticMatrix || rollCampaignStochasticMatrix();
    const startingIntent = activeStory.dynamicState.startingIntent || activeStory.dynamicState.defaultStartingIntent || 'The adventure begins as the protagonist prepares for what lies ahead.';

    if (!isJournalPreAuthored) {
      setState({ isUpdatingJournal: true });
      try {
        const journalPrompt = getInitialJournalGenerationPrompt(
          activeStory.title,
          activeStory.synopsis,
          activeStory.genre,
          charSheet,
          activeStory.language,
          stochasticMatrix,
          startingIntent
        );

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

          setState((s: StoryState) => {
            const updatedStories = s.stories.map((story: Story) => {
              if (story.id === targetStoryId) {
                return {
                  ...story,
                  dynamicState: {
                    ...story.dynamicState,
                    masterJournal: journal,
                    stochasticMatrix,
                    startingIntent,
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
        console.error('Error generating initial master journal, proceeding with default:', journalError);
      } finally {
        setState({ isUpdatingJournal: false });
      }
    } else {
      const matrixPrompt = formatStochasticMatrixPrompt(stochasticMatrix);
      if (!journal.includes('[CAMPAIGN STOCHASTIC MATRIX')) {
        journal = `${matrixPrompt}\n\n${journal}`;
      }
      if (startingIntent && !journal.includes('[STARTING SCENARIO IGNITION')) {
        journal = `[STARTING SCENARIO IGNITION & PLAYER INTENT]\n"${startingIntent}"\n\n${journal}`;
      }
      setState((s: StoryState) => {
        const updatedStories = s.stories.map((story: Story) => {
          if (story.id === targetStoryId) {
            return {
              ...story,
              dynamicState: {
                ...story.dynamicState,
                masterJournal: journal,
                stochasticMatrix,
                startingIntent,
              },
              updatedAt: Date.now(),
            };
          }
          return story;
        });
        return { stories: updatedStories };
      });
    }
  }

  const masterMessageId = 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6);

  try {
    const storyMessages = updatedMessages.filter((m: Message) => m.role === 'player' || m.role === 'master');
    const last10Messages = storyMessages.slice(-10);
    let masterResponseText = '';
    let apiPromptTokens = 0;
    let apiCompletionTokens = 0;

    const sections: PromptSections = {
      setting: activeStory.dynamicState.setting || '',
      characterSheet: activeStory.dynamicState.characterSheet || '',
      factions: activeStory.dynamicState.factions || '',
      conflicts: activeStory.dynamicState.conflicts || '',
      historicalFacts: activeStory.dynamicState.historicalFacts || '',
      lorebook: activeStory.dynamicState.lorebook || '',
    };
    const propensity = activeStory.narrativePropensity || 'balanced';
    const currentScratchpad = activeStory.dynamicState.judgeScratchpad || [];
    let judgeNote: string | undefined = undefined;
    let unEvictedScratchpad = [...currentScratchpad];
    let fateRoll: FateOracleRoll | undefined = undefined;

    if (!isStart) {
      fateRoll = rollFateOracle();
    }

    let judgeTokensData: { promptTokens: number; completionTokens: number; totalTokens: number } | undefined = undefined;
    let narratorTokensData: { promptTokens: number; completionTokens: number; totalTokens: number } | undefined = undefined;

    const streamProgressiveChunk = (fullText: string) => {
      masterResponseText = fullText;
      setState((s: StoryState) => {
        const updatedStories = s.stories.map((story: Story) => {
          if (story.id === targetStoryId) {
            const currentMsgs = [...story.messages];
            const existingIdx = currentMsgs.findIndex((m: Message) => m.id === masterMessageId);
            if (existingIdx !== -1) {
              currentMsgs[existingIdx] = {
                ...currentMsgs[existingIdx],
                content: fullText,
                fateRoll,
                stochasticMatrix,
                judgeNote,
              };
            } else {
              currentMsgs.push({
                id: masterMessageId,
                role: 'master',
                content: fullText,
                fateRoll,
                stochasticMatrix,
                judgeNote,
              });
            }
            return {
              ...story,
              messages: currentMsgs,
            };
          }
          return story;
        });
        return { stories: updatedStories };
      });
    };

    if (isStart) {
      const startingIntent = activeStory.dynamicState.startingIntent || activeStory.dynamicState.defaultStartingIntent || 'The adventure begins as the protagonist prepares for what lies ahead.';
      const turnZeroPrompt = getTurnZeroPrompt(
        sections,
        journal,
        startingIntent,
        propensity,
        activeStory.language,
        stochasticMatrix
      );

      masterResponseText = await fetchNarrative(
        provider,
        url,
        key,
        model,
        turnZeroPrompt,
        [],
        (usage) => {
          apiPromptTokens = usage.prompt_tokens;
          apiCompletionTokens = usage.completion_tokens;
        },
        (fullText) => {
          streamProgressiveChunk(fullText);
        }
      );

      narratorTokensData = {
        promptTokens: apiPromptTokens,
        completionTokens: apiCompletionTokens,
        totalTokens: apiPromptTokens + apiCompletionTokens,
      };
    } else {
      try {
        const judgePrompt = getJudgePrompt(
          charSheet,
          currentScratchpad,
          activeStory.language,
          feedback,
          lore,
          journal,
          sections,
          propensity,
          fateRoll
        );
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

        judgeNote = rawJudgeResponse.trim() || 'Nothing to note.';
        unEvictedScratchpad = [...currentScratchpad, judgeNote];

        judgeTokensData = {
          promptTokens: judgePromptTokens,
          completionTokens: judgeCompletionTokens,
          totalTokens: judgePromptTokens + judgeCompletionTokens,
        };

        const narratorPrompt = getNarratorPrompt(
          sections,
          journal,
          feedback,
          judgeNote,
          propensity,
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
          },
          (fullText) => {
            streamProgressiveChunk(fullText);
          }
        );

        narratorTokensData = {
          promptTokens: narratorPromptTokens,
          completionTokens: narratorCompletionTokens,
          totalTokens: narratorPromptTokens + narratorCompletionTokens,
        };

        apiPromptTokens = judgePromptTokens + narratorPromptTokens;
        apiCompletionTokens = judgeCompletionTokens + narratorCompletionTokens;
      } catch (pipelineErr) {
        console.error('[orchestrateMasterResponse] Error in agentic pipeline, falling back to unified prompt:', pipelineErr);
        const UNIFIED_PROMPT = formatUnifiedPrompt(lore, charSheet, journal, feedback, activeStory.language, propensity, sections, fateRoll, stochasticMatrix);
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
          },
          (fullText) => {
            streamProgressiveChunk(fullText);
          }
        );

        narratorTokensData = {
          promptTokens: apiPromptTokens,
          completionTokens: apiCompletionTokens,
          totalTokens: apiPromptTokens + apiCompletionTokens,
        };
      }
    }

    const masterMessage: Message = {
      id: masterMessageId,
      role: 'master',
      content: masterResponseText,
      tokens: apiCompletionTokens || estimateTokens(masterResponseText),
      promptTokens: apiPromptTokens || undefined,
      judgeNote,
      fateRoll,
      stochasticMatrix,
      judgeTokens: judgeTokensData,
      narratorTokens: narratorTokensData,
    };

    const evictedScratchpad = unEvictedScratchpad.slice(-5);

    setState((s: StoryState) => {
      const updatedStories = s.stories.map((story: Story) => {
        if (story.id === targetStoryId) {
          const currentMsgs = [...story.messages];
          const existingIdx = currentMsgs.findIndex((m: Message) => m.id === masterMessageId);
          if (existingIdx !== -1) {
            currentMsgs[existingIdx] = masterMessage;
          } else {
            currentMsgs.push(masterMessage);
          }

          return {
            ...story,
            messages: currentMsgs,
            dynamicState: {
              ...story.dynamicState,
              ...(stochasticMatrix ? { stochasticMatrix } : {}),
              masterJournal: journal,
              judgeScratchpad: evictedScratchpad,
            },
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

    const finalState = getState();
    const finalActiveStory = finalState.stories.find((s: Story) => s.id === targetStoryId);
    const finalMessages = finalActiveStory ? finalActiveStory.messages : [];

    // Check count for background updates (using targetStoryId closure)
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
        () => setState({ isUpdatingLorebook: true }),
        (response) => setState((s: StoryState) => {
          const updatedStories = s.stories.map((st) => {
            if (st.id === targetStoryId) {
              return {
                ...st,
                dynamicState: {
                  ...st.dynamicState,
                  lorebook: response,
                },
              };
            }
            return st;
          });
          return { stories: updatedStories };
        }),
        () => setState({ isUpdatingLorebook: false }),
        () => setState({ isUpdatingJournal: true }),
        (response) => setState((s: StoryState) => {
          const updatedStories = s.stories.map((st) => {
            if (st.id === targetStoryId) {
              return {
                ...st,
                dynamicState: {
                  ...st.dynamicState,
                  masterJournal: response,
                },
              };
            }
            return st;
          });
          return { stories: updatedStories };
        }),
        () => setState({ isUpdatingJournal: false }),
        unEvictedScratchpad
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

    setState((s: StoryState) => {
      const updatedStories = s.stories.map((story: Story) => {
        if (story.id === targetStoryId) {
          // Clean up any partially streamed master message on hard error
          const cleanMsgs = story.messages.filter((m: Message) => m.id !== masterMessageId);
          return {
            ...story,
            messages: [...cleanMsgs, errorMsg],
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
  } finally {
    setState({ isGeneratingStory: false });
  }
};
