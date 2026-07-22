import { Message } from '../types/story';
import { fetchNarrative } from './llmService';
import {
  formatLorebookPrompt,
  formatJournalPrompt,
  getLorebookSystemPrompt,
  getJournalSystemPrompt,
} from '../utils/prompts/storyPrompts';

export interface BackgroundUpdatesResult {
  updatedLorebook?: string;
  updatedJournal?: string;
}

export const executeBackgroundUpdates = async (
  provider: 'openrouter' | 'gemini' | 'openai',
  url: string,
  key: string,
  modelName: string,
  currentLorebook: string,
  currentJournal: string,
  recentMessages: Message[],
  language: string | undefined,
  onLorebookStart: () => void,
  onLorebookSuccess: (updatedLorebook: string) => void,
  onLorebookComplete: () => void,
  onJournalStart: () => void,
  onJournalSuccess: (updatedJournal: string) => void,
  onJournalComplete: () => void
): Promise<void> => {
  const recentMessagesText = recentMessages
    .map((msg) => `${msg.role === 'player' ? 'Player' : 'Master'}: ${msg.content}`)
    .join('\n\n');

  // Background update for Lorebook
  const updateLorebookPromise = (async () => {
    onLorebookStart();
    try {
      const lorePrompt = getLorebookSystemPrompt(language);
      const userContent = formatLorebookPrompt(currentLorebook, recentMessagesText);
      
      const response = await fetchNarrative(provider, url, key, modelName, lorePrompt, [
        { id: 'temp_lore', role: 'player', content: userContent }
      ]);

      const cleanedResponse = response.trim();
      if (cleanedResponse && cleanedResponse !== 'NO_CHANGES' && cleanedResponse !== "'NO_CHANGES'") {
        onLorebookSuccess(response);
      }
    } catch (err) {
      console.error('Error in background lorebook update:', err);
    } finally {
      onLorebookComplete();
    }
  })();

  // Background update for Master Journal
  const updateJournalPromise = (async () => {
    onJournalStart();
    try {
      const journalPrompt = getJournalSystemPrompt(language);
      const userContent = formatJournalPrompt(currentJournal, recentMessagesText);

      const response = await fetchNarrative(provider, url, key, modelName, journalPrompt, [
        { id: 'temp_journal', role: 'player', content: userContent }
      ]);

      const cleanedResponse = response.trim();
      if (cleanedResponse && cleanedResponse !== 'NO_CHANGES' && cleanedResponse !== "'NO_CHANGES'") {
        onJournalSuccess(response);
      }
    } catch (err) {
      console.error('Error in background master journal update:', err);
    } finally {
      onJournalComplete();
    }
  })();

  await Promise.allSettled([updateLorebookPromise, updateJournalPromise]);
};
