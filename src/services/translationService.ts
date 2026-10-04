import { fetchNarrative, cleanAndParseJson } from './llmService';
import { StorySections } from '../types/story';

export interface JourneyTranslationInput {
  title: string;
  synopsis: string;
  characterSheetContent: string;
  compiledLorebookMarkdown: string;
  masterJournal: string;
  sections?: StorySections;
}

export interface JourneyTranslationOutput {
  title: string;
  synopsis: string;
  characterSheetContent: string;
  compiledLorebookMarkdown: string;
  masterJournal: string;
  sections: StorySections;
}

/**
 * Translates all journey components into the target language in a single structured batch call,
 * with graceful fallback to original texts if translation fails.
 */
export const translateJourneyBatch = async (
  provider: 'openrouter' | 'gemini',
  url: string,
  key: string,
  modelName: string,
  targetLanguage: string,
  input: JourneyTranslationInput
): Promise<JourneyTranslationOutput> => {
  if (!key || targetLanguage.toLowerCase() === 'english') {
    return {
      title: input.title,
      synopsis: input.synopsis,
      characterSheetContent: input.characterSheetContent,
      compiledLorebookMarkdown: input.compiledLorebookMarkdown,
      masterJournal: input.masterJournal,
      sections: {
        setting: input.sections?.setting || '',
        characterSheet: input.characterSheetContent,
        factions: input.sections?.factions || '',
        conflicts: input.sections?.conflicts || '',
        historicalFacts: input.sections?.historicalFacts || '',
      },
    };
  }

  const payloadToTranslate = {
    title: input.title,
    synopsis: input.synopsis,
    characterSheet: input.characterSheetContent,
    lorebook: input.compiledLorebookMarkdown,
    masterJournal: input.masterJournal,
    setting: input.sections?.setting || '',
    factions: input.sections?.factions || '',
    conflicts: input.sections?.conflicts || '',
    historicalFacts: input.sections?.historicalFacts || '',
  };

  const systemPrompt = `You are a professional RPG translator and worldbuilder.
Translate the JSON object provided in the message into ${targetLanguage}.
Rules:
- Preserve all structural formatting, newlines, markdown headers, and bullet points.
- Return ONLY a valid JSON object matching the input schema exactly.
- Do NOT add conversational prose, explanations, or wrapper markdown other than the JSON block.`;

  try {
    const rawResponse = await fetchNarrative(
      provider,
      url,
      key,
      modelName,
      systemPrompt,
      [
        {
          id: 'trans_batch_' + Date.now(),
          role: 'player',
          content: JSON.stringify(payloadToTranslate, null, 2),
        },
      ]
    );

    const parsed = cleanAndParseJson<typeof payloadToTranslate>(rawResponse);
    if (parsed && typeof parsed === 'object') {
      const charSheet = parsed.characterSheet || input.characterSheetContent;
      return {
        title: parsed.title || input.title,
        synopsis: parsed.synopsis || input.synopsis,
        characterSheetContent: charSheet,
        compiledLorebookMarkdown: parsed.lorebook || input.compiledLorebookMarkdown,
        masterJournal: parsed.masterJournal || input.masterJournal,
        sections: {
          setting: parsed.setting || input.sections?.setting || '',
          characterSheet: charSheet,
          factions: parsed.factions || input.sections?.factions || '',
          conflicts: parsed.conflicts || input.sections?.conflicts || '',
          historicalFacts: parsed.historicalFacts || input.sections?.historicalFacts || '',
        },
      };
    }
  } catch (err) {
    console.warn('[translateJourneyBatch] Batch translation failed or timed out, using source text:', err);
  }

  // Graceful fallback to original content
  return {
    title: input.title,
    synopsis: input.synopsis,
    characterSheetContent: input.characterSheetContent,
    compiledLorebookMarkdown: input.compiledLorebookMarkdown,
    masterJournal: input.masterJournal,
    sections: {
      setting: input.sections?.setting || '',
      characterSheet: input.characterSheetContent,
      factions: input.sections?.factions || '',
      conflicts: input.sections?.conflicts || '',
      historicalFacts: input.sections?.historicalFacts || '',
    },
  };
};
