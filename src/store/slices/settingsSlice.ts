import { StateCreator } from 'zustand';
import { StoryState, LLMProvider } from '../../types/story';

export interface SettingsSlice {
  llmProvider: LLMProvider;
  llmUrl: string;
  llmKey: string;
  modelName: string;

  updateLlmSettings: (
    provider: LLMProvider,
    url: string,
    key: string,
    modelName: string
  ) => void;
}

export const createSettingsSlice: StateCreator<
  StoryState,
  [],
  [],
  SettingsSlice
> = (set) => ({
  llmProvider: (import.meta.env.VITE_LLM_URL?.includes('localhost') || import.meta.env.VITE_LLM_URL?.includes('127.0.0.1'))
    ? 'local'
    : (import.meta.env.VITE_LLM_URL?.includes('generativelanguage') || import.meta.env.VITE_MODEL_NAME?.toLowerCase().startsWith('gemini'))
    ? 'gemini'
    : 'openrouter',
  llmUrl: import.meta.env.VITE_LLM_URL || 'https://openrouter.ai/api/v1/chat/completions',
  llmKey: import.meta.env.VITE_LLM_KEY || '',
  modelName: import.meta.env.VITE_MODEL_NAME || 'google/gemma-2-9b-it:free',

  updateLlmSettings: (
    provider: LLMProvider,
    url: string,
    key: string,
    modelName: string
  ) =>
    set(() => ({
      llmProvider: provider,
      llmUrl: url,
      llmKey: key,
      modelName,
    })),
});
