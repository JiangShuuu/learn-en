import { DifficultyLevel, WordType } from '@/types';

// CEFR Level Descriptions
export const CEFR_LEVELS: Record<DifficultyLevel, { name: string; description: string }> = {
  A1: {
    name: 'Beginner',
    description: '基礎入門 - 日常基本詞彙',
  },
  A2: {
    name: 'Elementary',
    description: '初級 - 常用生活詞彙',
  },
  B1: {
    name: 'Intermediate',
    description: '中級 - 工作學習詞彙',
  },
  B2: {
    name: 'Upper Intermediate',
    description: '中高級 - 專業領域詞彙',
  },
  C1: {
    name: 'Advanced',
    description: '高級 - 學術專業詞彙',
  },
  C2: {
    name: 'Proficiency',
    description: '精通 - 母語水平詞彙',
  },
};

// Word Type Translations
export const WORD_TYPES: Record<WordType, { name: string; name_zh: string; color: string }> = {
  noun: { name: 'Noun', name_zh: '名詞', color: '#3B82F6' },
  verb: { name: 'Verb', name_zh: '動詞', color: '#10B981' },
  adjective: { name: 'Adjective', name_zh: '形容詞', color: '#F59E0B' },
  adverb: { name: 'Adverb', name_zh: '副詞', color: '#8B5CF6' },
  pronoun: { name: 'Pronoun', name_zh: '代名詞', color: '#EC4899' },
  preposition: { name: 'Preposition', name_zh: '介系詞', color: '#6366F1' },
  conjunction: { name: 'Conjunction', name_zh: '連接詞', color: '#14B8A6' },
  interjection: { name: 'Interjection', name_zh: '感嘆詞', color: '#EF4444' },
};

// SM-2 Algorithm Constants
export const SRS_CONFIG = {
  INITIAL_EASE_FACTOR: 2.5,
  MIN_EASE_FACTOR: 1.3,
  QUALITY_THRESHOLD: 3, // Below this is considered failure
  INITIAL_INTERVAL: 1, // days
  EASE_FACTOR_ADJUSTMENT: {
    5: 0.1,  // Perfect response
    4: 0.0,  // Correct with hesitation
    3: -0.14, // Correct with difficulty
    2: -0.14, // Incorrect but remembered
    1: -0.2,  // Incorrect
    0: -0.2,  // Complete blackout
  },
};

// Default daily word configuration
export const DAILY_WORD_CONFIG = {
  DEFAULT_GOAL: 20,
  NEW_WORDS_RATIO: 0.5, // 50% new, 50% review
  MIN_NEW_WORDS: 5,
  MAX_NEW_WORDS: 15,
};
