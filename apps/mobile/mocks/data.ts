import { Flashcard, UserProfile, LearningProgress, DailyWord, UserStats, DifficultyLevel } from '@/types';

// Mock user
export const mockUser = {
  id: 'mock-user-1',
  email: 'demo@learnen.com',
  display_name: 'Demo User',
};

// Mock profile
export const mockProfile: UserProfile = {
  id: 'mock-user-1',
  email: 'demo@learnen.com',
  display_name: 'Demo User',
  daily_goal: 20,
  current_level: 'A2',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-20T00:00:00.000Z',
};

// Mock flashcards
export const mockFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    word: 'hello',
    type: 'interjection',
    phonetic: '/həˈloʊ/',
    audio_url: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3',
    definition_en: 'Used as a greeting or to begin a phone conversation',
    definition_zh: '哈囉、你好（用作問候語或開始電話對話）',
    examples: [
      {
        sentence_en: 'Hello, how are you today?',
        sentence_zh: '你好，你今天好嗎？',
      },
      {
        sentence_en: 'She said hello to everyone in the room.',
        sentence_zh: '她向房間裡的每個人打招呼。',
      },
    ],
    difficulty_level: 'A1',
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-10T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-2',
    word: 'book',
    type: 'noun',
    phonetic: '/bʊk/',
    audio_url: '',
    definition_en: 'A written or printed work consisting of pages glued or sewn together',
    definition_zh: '書本；書籍',
    examples: [
      {
        sentence_en: 'I love reading books in my free time.',
        sentence_zh: '我喜歡在空閒時間看書。',
      },
      {
        sentence_en: 'This book is very interesting.',
        sentence_zh: '這本書非常有趣。',
      },
    ],
    difficulty_level: 'A1',
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-10T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-3',
    word: 'study',
    type: 'verb',
    phonetic: '/ˈstʌdi/',
    audio_url: '',
    definition_en: 'To devote time and attention to acquiring knowledge',
    definition_zh: '學習；研究',
    examples: [
      {
        sentence_en: 'I study English every day.',
        sentence_zh: '我每天學習英文。',
      },
      {
        sentence_en: 'She studies hard for her exams.',
        sentence_zh: '她為考試努力學習。',
      },
    ],
    difficulty_level: 'A1',
    created_at: '2025-01-11T00:00:00.000Z',
    updated_at: '2025-01-11T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-4',
    word: 'beautiful',
    type: 'adjective',
    phonetic: '/ˈbjuːtɪfəl/',
    audio_url: '',
    definition_en: 'Pleasing the senses or mind aesthetically',
    definition_zh: '美麗的；漂亮的',
    examples: [
      {
        sentence_en: 'The sunset is beautiful tonight.',
        sentence_zh: '今晚的日落很美。',
      },
      {
        sentence_en: 'She has a beautiful voice.',
        sentence_zh: '她有一個美妙的聲音。',
      },
    ],
    difficulty_level: 'A1',
    created_at: '2025-01-12T00:00:00.000Z',
    updated_at: '2025-01-12T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-5',
    word: 'important',
    type: 'adjective',
    phonetic: '/ɪmˈpɔːtənt/',
    audio_url: '',
    definition_en: 'Of great significance or value',
    definition_zh: '重要的',
    examples: [
      {
        sentence_en: 'Education is very important.',
        sentence_zh: '教育非常重要。',
      },
      {
        sentence_en: 'This is an important decision.',
        sentence_zh: '這是一個重要的決定。',
      },
    ],
    difficulty_level: 'A2',
    created_at: '2025-01-13T00:00:00.000Z',
    updated_at: '2025-01-13T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-6',
    word: 'understand',
    type: 'verb',
    phonetic: '/ˌʌndərˈstænd/',
    audio_url: '',
    definition_en: 'To perceive the intended meaning of words or a speaker',
    definition_zh: '理解；明白',
    examples: [
      {
        sentence_en: 'Do you understand what I mean?',
        sentence_zh: '你明白我的意思嗎？',
      },
      {
        sentence_en: 'I understand your concern.',
        sentence_zh: '我理解你的擔憂。',
      },
    ],
    difficulty_level: 'A2',
    created_at: '2025-01-14T00:00:00.000Z',
    updated_at: '2025-01-14T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-7',
    word: 'achieve',
    type: 'verb',
    phonetic: '/əˈtʃiːv/',
    audio_url: '',
    definition_en: 'To successfully bring about or reach a desired objective',
    definition_zh: '達成；實現',
    examples: [
      {
        sentence_en: 'She achieved her goal of learning English.',
        sentence_zh: '她實現了學習英語的目標。',
      },
      {
        sentence_en: 'Hard work helps you achieve success.',
        sentence_zh: '努力工作幫助你獲得成功。',
      },
    ],
    difficulty_level: 'B1',
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2025-01-15T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-8',
    word: 'consequently',
    type: 'adverb',
    phonetic: '/ˈkɒnsɪkwəntli/',
    audio_url: '',
    definition_en: 'As a result; therefore',
    definition_zh: '因此；所以',
    examples: [
      {
        sentence_en: 'He studied hard; consequently, he passed the exam.',
        sentence_zh: '他努力學習；因此，他通過了考試。',
      },
      {
        sentence_en: 'It rained heavily, and consequently the match was postponed.',
        sentence_zh: '雨下得很大，因此比賽被推遲了。',
      },
    ],
    difficulty_level: 'B1',
    created_at: '2025-01-16T00:00:00.000Z',
    updated_at: '2025-01-16T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-9',
    word: 'sophisticated',
    type: 'adjective',
    phonetic: '/səˈfɪstɪkeɪtɪd/',
    audio_url: '',
    definition_en: 'Having or appealing to refined taste and knowledge',
    definition_zh: '精緻的；複雜的；老練的',
    examples: [
      {
        sentence_en: 'She has a sophisticated taste in art.',
        sentence_zh: '她對藝術有精緻的品味。',
      },
      {
        sentence_en: 'This is a sophisticated computer system.',
        sentence_zh: '這是一個複雜的電腦系統。',
      },
    ],
    difficulty_level: 'B2',
    created_at: '2025-01-17T00:00:00.000Z',
    updated_at: '2025-01-17T00:00:00.000Z',
    is_shared: true,
  },
  {
    id: 'fc-10',
    word: 'comprehensive',
    type: 'adjective',
    phonetic: '/ˌkɒmprɪˈhensɪv/',
    audio_url: '',
    definition_en: 'Complete and including everything that is necessary',
    definition_zh: '全面的；綜合的',
    examples: [
      {
        sentence_en: 'We need a comprehensive plan.',
        sentence_zh: '我們需要一個全面的計劃。',
      },
      {
        sentence_en: 'The report provides a comprehensive analysis.',
        sentence_zh: '這份報告提供了全面的分析。',
      },
    ],
    difficulty_level: 'B2',
    created_at: '2025-01-18T00:00:00.000Z',
    updated_at: '2025-01-18T00:00:00.000Z',
    is_shared: true,
  },
];

// Mock learning progress
export const mockLearningProgress: LearningProgress[] = [
  {
    id: 'lp-1',
    flashcard_id: 'fc-1',
    user_id: 'mock-user-1',
    status: 'mastered',
    last_reviewed: '2025-01-19T00:00:00.000Z',
    next_review: '2025-01-26T00:00:00.000Z',
    ease_factor: 2.6,
    interval: 7,
    repetitions: 5,
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-19T00:00:00.000Z',
  },
  {
    id: 'lp-2',
    flashcard_id: 'fc-2',
    user_id: 'mock-user-1',
    status: 'familiar',
    last_reviewed: '2025-01-18T00:00:00.000Z',
    next_review: '2025-01-22T00:00:00.000Z',
    ease_factor: 2.5,
    interval: 4,
    repetitions: 3,
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-18T00:00:00.000Z',
  },
  {
    id: 'lp-3',
    flashcard_id: 'fc-3',
    user_id: 'mock-user-1',
    status: 'learning',
    last_reviewed: '2025-01-19T00:00:00.000Z',
    next_review: '2025-01-20T00:00:00.000Z',
    ease_factor: 2.5,
    interval: 1,
    repetitions: 1,
    created_at: '2025-01-11T00:00:00.000Z',
    updated_at: '2025-01-19T00:00:00.000Z',
  },
];

// Mock daily words
const today = new Date().toISOString().split('T')[0];
export const mockDailyWords: DailyWord[] = [
  {
    id: 'dw-1',
    user_id: 'mock-user-1',
    flashcard_id: 'fc-3',
    date: today,
    completed: false,
    created_at: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'dw-2',
    user_id: 'mock-user-1',
    flashcard_id: 'fc-4',
    date: today,
    completed: false,
    created_at: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'dw-3',
    user_id: 'mock-user-1',
    flashcard_id: 'fc-5',
    date: today,
    completed: true,
    rating: 4,
    created_at: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'dw-4',
    user_id: 'mock-user-1',
    flashcard_id: 'fc-6',
    date: today,
    completed: true,
    rating: 5,
    created_at: '2025-01-20T00:00:00.000Z',
  },
];

// Mock user stats
export const mockUserStats: UserStats = {
  id: 'stats-1',
  user_id: 'mock-user-1',
  total_words: 10,
  words_learning: 3,
  words_familiar: 4,
  words_mastered: 3,
  current_streak: 5,
  longest_streak: 12,
  total_reviews: 45,
  last_study_date: today,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-20T00:00:00.000Z',
};

// Helper to get flashcard by ID
export const getFlashcardById = (id: string): Flashcard | undefined => {
  return mockFlashcards.find(fc => fc.id === id);
};

// Helper to get flashcards by difficulty
export const getFlashcardsByDifficulty = (level: DifficultyLevel): Flashcard[] => {
  return mockFlashcards.filter(fc => fc.difficulty_level === level);
};
