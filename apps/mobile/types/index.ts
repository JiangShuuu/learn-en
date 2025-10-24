// CEFR Difficulty Levels
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Word Types
export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';

// Learning Status
export type LearningStatus = 'new' | 'learning' | 'familiar' | 'mastered';

// Flashcard Model
export interface Flashcard {
  id: string;
  word: string;
  type: WordType;
  phonetic?: string;
  audio_url?: string;
  definition_en: string;
  definition_zh: string;
  examples: Example[];
  difficulty_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
  user_id?: string; // for manually added words
}

// Example Sentence
export interface Example {
  sentence_en: string;
  sentence_zh: string;
}

// Learning Progress (for SRS)
export interface LearningProgress {
  id: string;
  flashcard_id: string;
  user_id: string;
  status: LearningStatus;
  last_reviewed: string | null;
  next_review: string | null;
  ease_factor: number; // SM-2 algorithm parameter
  interval: number; // days until next review
  repetitions: number; // number of successful reviews
  created_at: string;
  updated_at: string;
}

// Daily Word Assignment
export interface DailyWord {
  id: string;
  user_id: string;
  flashcard_id: string;
  date: string;
  completed: boolean;
  rating?: number; // 1-5, user's difficulty rating
  created_at: string;
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  daily_goal: number; // default 20
  current_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
}

// Dictionary API Response (Free Dictionary API)
export interface DictionaryAPIResponse {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

// Study Session Review
export interface ReviewResult {
  flashcard_id: string;
  quality: number; // 0-5 rating for SM-2 algorithm
  timestamp: string;
}

// Statistics
export interface UserStats {
  total_words: number;
  words_learning: number;
  words_familiar: number;
  words_mastered: number;
  current_streak: number;
  longest_streak: number;
  total_reviews: number;
}
