import { apiClient } from '@/lib/api-client';
import { mockAPI } from '@/mocks/api';
import {
  Flashcard,
  LearningProgress,
  DailyWord,
  UserStats,
  DifficultyLevel,
  LearningStatus,
} from '@/types';

const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

// Flashcard operations
export const flashcardService = {
  // Get all shared flashcards
  async getSharedFlashcards(limit?: number): Promise<Flashcard[]> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.getShared(limit);
    }
    return apiClient.get<Flashcard[]>('/flashcards/shared', { limit });
  },

  // Get user's custom flashcards
  async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.getUserFlashcards(userId);
    }
    return apiClient.get<Flashcard[]>(`/flashcards/user/${userId}`);
  },

  // Get flashcards by difficulty
  async getFlashcardsByDifficulty(level: DifficultyLevel): Promise<Flashcard[]> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.getByDifficulty(level);
    }
    return apiClient.get<Flashcard[]>('/flashcards', { difficulty: level });
  },

  // Create a flashcard
  async createFlashcard(flashcard: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>): Promise<Flashcard> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.create(flashcard);
    }
    return apiClient.post<Flashcard>('/flashcards', flashcard);
  },

  // Update a flashcard
  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.update(id, updates);
    }
    return apiClient.patch<Flashcard>(`/flashcards/${id}`, updates);
  },

  // Delete a flashcard
  async deleteFlashcard(id: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.delete(id);
    }
    await apiClient.delete(`/flashcards/${id}`);
  },

  // Get flashcard by ID
  async getFlashcardById(id: string): Promise<Flashcard> {
    if (USE_MOCK_API) {
      return mockAPI.flashcards.getById(id);
    }
    return apiClient.get<Flashcard>(`/flashcards/${id}`);
  },
};

// Learning progress operations
export const progressService = {
  // Get user's learning progress
  async getUserProgress(userId: string): Promise<LearningProgress[]> {
    if (USE_MOCK_API) {
      return mockAPI.progress.getUserProgress(userId);
    }
    return apiClient.get<LearningProgress[]>(`/progress/user/${userId}`);
  },

  // Get progress for a specific flashcard
  async getFlashcardProgress(userId: string, flashcardId: string): Promise<LearningProgress | null> {
    if (USE_MOCK_API) {
      return mockAPI.progress.getFlashcardProgress(flashcardId);
    }
    try {
      return await apiClient.get<LearningProgress>(`/progress/${flashcardId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update progress
  async upsertProgress(progress: Omit<LearningProgress, 'id' | 'created_at' | 'updated_at'>): Promise<LearningProgress> {
    if (USE_MOCK_API) {
      return mockAPI.progress.upsert(progress);
    }
    return apiClient.post<LearningProgress>('/progress', progress);
  },

  // Get due flashcards for review
  async getDueFlashcards(userId: string): Promise<LearningProgress[]> {
    if (USE_MOCK_API) {
      return mockAPI.progress.getDue(userId);
    }
    return apiClient.get<LearningProgress[]>('/progress/due', { userId });
  },

  // Get progress by status
  async getProgressByStatus(userId: string, status: LearningStatus): Promise<LearningProgress[]> {
    if (USE_MOCK_API) {
      return mockAPI.progress.getByStatus(userId, status);
    }
    return apiClient.get<LearningProgress[]>('/progress', {
      userId,
      status,
    });
  },

  // Update progress after review
  async updateProgress(id: string, updates: Partial<LearningProgress>): Promise<LearningProgress> {
    if (USE_MOCK_API) {
      // For mock, use upsert since we don't have a separate update
      return mockAPI.progress.upsert(updates as any);
    }
    return apiClient.patch<LearningProgress>(`/progress/${id}`, updates);
  },
};

// Daily words operations
export const dailyWordsService = {
  // Get today's words for user
  async getTodayWords(userId: string): Promise<DailyWord[]> {
    if (USE_MOCK_API) {
      return mockAPI.dailyWords.getToday();
    }
    return apiClient.get<DailyWord[]>('/daily-words/today');
  },

  // Create daily words
  async createDailyWords(words: Omit<DailyWord, 'id' | 'created_at'>[]): Promise<DailyWord[]> {
    if (USE_MOCK_API) {
      return mockAPI.dailyWords.createBatch(words);
    }
    return apiClient.post<DailyWord[]>('/daily-words/batch', { words });
  },

  // Mark word as completed
  async markWordCompleted(id: string, rating: number): Promise<void> {
    if (USE_MOCK_API) {
      return mockAPI.dailyWords.markCompleted(id, rating);
    }
    await apiClient.patch(`/daily-words/${id}`, {
      completed: true,
      rating,
    });
  },

  // Get words history
  async getWordsHistory(userId: string, days: number = 7): Promise<DailyWord[]> {
    if (USE_MOCK_API) {
      return mockAPI.dailyWords.getHistory(userId, days);
    }
    return apiClient.get<DailyWord[]>('/daily-words/history', {
      userId,
      days,
    });
  },

  // Generate daily words
  async generateDailyWords(): Promise<DailyWord[]> {
    if (USE_MOCK_API) {
      return mockAPI.dailyWords.generate();
    }
    return apiClient.post<DailyWord[]>('/daily-words/generate');
  },
};

// User stats operations
export const statsService = {
  // Get user stats
  async getUserStats(userId: string): Promise<UserStats | null> {
    if (USE_MOCK_API) {
      return mockAPI.stats.get(userId);
    }
    try {
      return await apiClient.get<UserStats>(`/stats/${userId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Update user stats
  async updateStats(userId: string, updates: Partial<UserStats>): Promise<void> {
    if (USE_MOCK_API) {
      return mockAPI.stats.update(userId, updates);
    }
    await apiClient.patch(`/stats/${userId}`, updates);
  },

  // Increment total reviews
  async incrementReviews(userId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockAPI.stats.incrementReviews(userId);
    }
    await apiClient.post(`/stats/${userId}/increment-reviews`);
  },

  // Update streak
  async updateStreak(userId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockAPI.stats.updateStreak(userId);
    }
    await apiClient.post(`/stats/${userId}/update-streak`);
  },

  // Get statistics summary
  async getStatsSummary(): Promise<UserStats> {
    if (USE_MOCK_API) {
      return mockAPI.stats.getSummary();
    }
    return apiClient.get<UserStats>('/stats/summary');
  },
};
