import {
  mockUser,
  mockProfile,
  mockFlashcards,
  mockLearningProgress,
  mockDailyWords,
  mockUserStats,
  getFlashcardById,
  getFlashcardsByDifficulty,
} from './data';
import {
  Flashcard,
  UserProfile,
  LearningProgress,
  DailyWord,
  UserStats,
  DifficultyLevel,
  LearningStatus,
} from '@/types';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Storage for mock data (in-memory)
let flashcardsStore = [...mockFlashcards];
let progressStore = [...mockLearningProgress];
let dailyWordsStore = [...mockDailyWords];
let userStatsStore = { ...mockUserStats };
let currentUser = { ...mockUser };
let currentProfile = { ...mockProfile };

// Generate unique ID
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const mockAPI = {
  // Authentication
  auth: {
    async login(email: string, password: string) {
      await delay();
      // Simple mock login - accept any email/password
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: currentUser,
        profile: currentProfile,
      };
    },

    async register(email: string, password: string, display_name?: string) {
      await delay();
      // Mock successful registration
      return {
        message: '註冊成功',
      };
    },

    async logout() {
      await delay();
      return { message: '登出成功' };
    },
  },

  // Profile
  profile: {
    async get(): Promise<UserProfile> {
      await delay();
      return currentProfile;
    },

    async update(updates: Partial<UserProfile>): Promise<UserProfile> {
      await delay();
      currentProfile = { ...currentProfile, ...updates, updated_at: new Date().toISOString() };
      return currentProfile;
    },
  },

  // Flashcards
  flashcards: {
    async getShared(limit?: number): Promise<Flashcard[]> {
      await delay();
      const shared = flashcardsStore.filter(fc => fc.is_shared);
      return limit ? shared.slice(0, limit) : shared;
    },

    async getUserFlashcards(userId: string): Promise<Flashcard[]> {
      await delay();
      return flashcardsStore.filter(fc => fc.user_id === userId);
    },

    async getByDifficulty(level: DifficultyLevel): Promise<Flashcard[]> {
      await delay();
      return flashcardsStore.filter(fc => fc.difficulty_level === level && fc.is_shared);
    },

    async getById(id: string): Promise<Flashcard> {
      await delay();
      const flashcard = flashcardsStore.find(fc => fc.id === id);
      if (!flashcard) throw new Error('Flashcard not found');
      return flashcard;
    },

    async create(data: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> {
      await delay();
      const newFlashcard: Flashcard = {
        ...data,
        id: generateId('fc'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      flashcardsStore.push(newFlashcard);
      return newFlashcard;
    },

    async update(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
      await delay();
      const index = flashcardsStore.findIndex(fc => fc.id === id);
      if (index === -1) throw new Error('Flashcard not found');

      flashcardsStore[index] = {
        ...flashcardsStore[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return flashcardsStore[index];
    },

    async delete(id: string): Promise<void> {
      await delay();
      flashcardsStore = flashcardsStore.filter(fc => fc.id !== id);
    },
  },

  // Learning Progress
  progress: {
    async getUserProgress(userId: string): Promise<LearningProgress[]> {
      await delay();
      return progressStore.filter(p => p.user_id === userId);
    },

    async getFlashcardProgress(flashcardId: string): Promise<LearningProgress | null> {
      await delay();
      return progressStore.find(p => p.flashcard_id === flashcardId) || null;
    },

    async upsert(data: Omit<LearningProgress, 'id' | 'created_at' | 'updated_at'>): Promise<LearningProgress> {
      await delay();
      const existing = progressStore.findIndex(
        p => p.flashcard_id === data.flashcard_id && p.user_id === data.user_id
      );

      if (existing !== -1) {
        progressStore[existing] = {
          ...progressStore[existing],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return progressStore[existing];
      } else {
        const newProgress: LearningProgress = {
          ...data,
          id: generateId('lp'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        progressStore.push(newProgress);
        return newProgress;
      }
    },

    async getDue(userId: string): Promise<LearningProgress[]> {
      await delay();
      const now = new Date();
      return progressStore.filter(
        p => p.user_id === userId && p.next_review && new Date(p.next_review) <= now
      );
    },

    async getByStatus(userId: string, status: LearningStatus): Promise<LearningProgress[]> {
      await delay();
      return progressStore.filter(p => p.user_id === userId && p.status === status);
    },
  },

  // Daily Words
  dailyWords: {
    async getToday(): Promise<DailyWord[]> {
      await delay();
      const today = new Date().toISOString().split('T')[0];
      return dailyWordsStore.filter(dw => dw.date === today);
    },

    async createBatch(words: Omit<DailyWord, 'id' | 'created_at'>[]): Promise<DailyWord[]> {
      await delay();
      const newWords = words.map(w => ({
        ...w,
        id: generateId('dw'),
        created_at: new Date().toISOString(),
      }));
      dailyWordsStore.push(...newWords);
      return newWords;
    },

    async markCompleted(id: string, rating: number): Promise<void> {
      await delay();
      const word = dailyWordsStore.find(dw => dw.id === id);
      if (word) {
        word.completed = true;
        word.rating = rating;
      }
    },

    async getHistory(userId: string, days: number): Promise<DailyWord[]> {
      await delay();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      return dailyWordsStore.filter(
        dw => dw.user_id === userId && dw.date >= startDateStr
      );
    },

    async generate(): Promise<DailyWord[]> {
      await delay();
      // Mock generate - return existing today's words
      return this.getToday();
    },
  },

  // User Stats
  stats: {
    async get(userId: string): Promise<UserStats> {
      await delay();
      return userStatsStore;
    },

    async update(userId: string, updates: Partial<UserStats>): Promise<void> {
      await delay();
      userStatsStore = {
        ...userStatsStore,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    },

    async incrementReviews(userId: string): Promise<void> {
      await delay();
      userStatsStore.total_reviews += 1;
      userStatsStore.updated_at = new Date().toISOString();
    },

    async updateStreak(userId: string): Promise<void> {
      await delay();
      const today = new Date().toISOString().split('T')[0];
      const lastStudy = userStatsStore.last_study_date;

      if (lastStudy === today) {
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastStudy === yesterdayStr) {
        userStatsStore.current_streak += 1;
      } else {
        userStatsStore.current_streak = 1;
      }

      userStatsStore.longest_streak = Math.max(
        userStatsStore.current_streak,
        userStatsStore.longest_streak
      );
      userStatsStore.last_study_date = today;
      userStatsStore.updated_at = new Date().toISOString();
    },

    async getSummary(): Promise<UserStats> {
      await delay();
      return userStatsStore;
    },
  },
};
