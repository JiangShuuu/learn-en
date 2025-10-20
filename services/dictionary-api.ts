import axios from 'axios';
import { DictionaryAPIResponse, WordType, Example } from '@/types';

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Word type mapping from API to our types
const mapWordType = (partOfSpeech: string): WordType => {
  const normalized = partOfSpeech.toLowerCase();
  if (normalized.includes('noun')) return 'noun';
  if (normalized.includes('verb')) return 'verb';
  if (normalized.includes('adjective')) return 'adjective';
  if (normalized.includes('adverb')) return 'adverb';
  if (normalized.includes('pronoun')) return 'pronoun';
  if (normalized.includes('preposition')) return 'preposition';
  if (normalized.includes('conjunction')) return 'conjunction';
  if (normalized.includes('interjection')) return 'interjection';
  return 'noun'; // default
};

export interface WordDefinition {
  word: string;
  type: WordType;
  phonetic?: string;
  audio_url?: string;
  definition_en: string;
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
}

export const dictionaryAPI = {
  // Search for a word
  async searchWord(word: string): Promise<WordDefinition | null> {
    try {
      const response = await axios.get<DictionaryAPIResponse[]>(
        `${DICTIONARY_API_BASE}/${word.trim().toLowerCase()}`
      );

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const data = response.data[0];

      // Get phonetic and audio
      const phonetic = data.phonetic || data.phonetics[0]?.text || '';
      const audio_url = data.phonetics.find((p) => p.audio)?.audio || '';

      // Get the first meaning
      const firstMeaning = data.meanings[0];
      if (!firstMeaning) return null;

      const type = mapWordType(firstMeaning.partOfSpeech);

      // Get definition and example
      const firstDef = firstMeaning.definitions[0];
      const definition_en = firstDef?.definition || '';

      // Collect examples from multiple definitions
      const examples: Example[] = [];
      firstMeaning.definitions.forEach((def) => {
        if (def.example && examples.length < 3) {
          examples.push({
            sentence_en: def.example,
            sentence_zh: '', // Will need to be translated
          });
        }
      });

      // Collect synonyms and antonyms
      const synonyms = firstDef?.synonyms || [];
      const antonyms = firstDef?.antonyms || [];

      return {
        word: data.word,
        type,
        phonetic,
        audio_url,
        definition_en,
        examples,
        synonyms,
        antonyms,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Word not found
      }
      console.error('Dictionary API error:', error);
      throw new Error('Failed to fetch word definition');
    }
  },

  // Get multiple definitions for a word (all parts of speech)
  async getAllDefinitions(word: string): Promise<WordDefinition[]> {
    try {
      const response = await axios.get<DictionaryAPIResponse[]>(
        `${DICTIONARY_API_BASE}/${word.trim().toLowerCase()}`
      );

      if (!response.data || response.data.length === 0) {
        return [];
      }

      const data = response.data[0];
      const definitions: WordDefinition[] = [];

      // Get phonetic and audio
      const phonetic = data.phonetic || data.phonetics[0]?.text || '';
      const audio_url = data.phonetics.find((p) => p.audio)?.audio || '';

      // Process each meaning (part of speech)
      data.meanings.forEach((meaning) => {
        const type = mapWordType(meaning.partOfSpeech);
        const firstDef = meaning.definitions[0];

        if (!firstDef) return;

        // Collect examples
        const examples: Example[] = [];
        meaning.definitions.forEach((def) => {
          if (def.example && examples.length < 3) {
            examples.push({
              sentence_en: def.example,
              sentence_zh: '', // Will need to be translated
            });
          }
        });

        // Collect synonyms and antonyms
        const synonyms = firstDef.synonyms || [];
        const antonyms = firstDef.antonyms || [];

        definitions.push({
          word: data.word,
          type,
          phonetic,
          audio_url,
          definition_en: firstDef.definition,
          examples,
          synonyms,
          antonyms,
        });
      });

      return definitions;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      console.error('Dictionary API error:', error);
      throw new Error('Failed to fetch word definitions');
    }
  },

  // Validate if a word exists
  async validateWord(word: string): Promise<boolean> {
    try {
      const result = await this.searchWord(word);
      return result !== null;
    } catch {
      return false;
    }
  },
};

// Translation service placeholder
// In production, you would use Google Translate API or similar
export const translationService = {
  async translateToZh(text: string): Promise<string> {
    // TODO: Implement actual translation
    // For now, return a placeholder
    // You can use services like:
    // - Google Translate API
    // - LibreTranslate (open source)
    // - Azure Translator
    return `[翻譯] ${text}`;
  },

  async translateExamples(examples: Example[]): Promise<Example[]> {
    // TODO: Implement batch translation
    return examples.map((ex) => ({
      ...ex,
      sentence_zh: `[翻譯] ${ex.sentence_en}`,
    }));
  },
};
