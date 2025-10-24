import { DifficultyLevel, Flashcard, LearningProgress, DailyWord } from '@/types';
import { DAILY_WORD_CONFIG } from '@/constants/vocabulary';
import { flashcardService, progressService, dailyWordsService } from './database';
import { srsAlgorithm } from '@/utils/srs-algorithm';

interface DailyWordGenerationOptions {
  userId: string;
  currentLevel: DifficultyLevel;
  dailyGoal?: number;
  includeReviews?: boolean;
}

export const dailyWordsGenerator = {
  /**
   * Generate daily words for a user
   * Combines new words and due reviews based on SRS algorithm
   */
  async generateDailyWords(options: DailyWordGenerationOptions): Promise<DailyWord[]> {
    const {
      userId,
      currentLevel,
      dailyGoal = DAILY_WORD_CONFIG.DEFAULT_GOAL,
      includeReviews = true,
    } = options;

    const today = new Date().toISOString().split('T')[0];

    // Check if words already generated for today
    const existingToday = await dailyWordsService.getTodayWords(userId);
    if (existingToday.length > 0) {
      return existingToday;
    }

    const selectedFlashcards: Flashcard[] = [];

    // Step 1: Get due reviews (priority)
    let dueReviews: LearningProgress[] = [];
    let reviewCount = 0;

    if (includeReviews) {
      dueReviews = await progressService.getDueFlashcards(userId);
      // Prioritize reviews
      dueReviews = srsAlgorithm.prioritizeReviews(dueReviews);

      // Take up to 50% of daily goal for reviews, but at least get the most overdue
      const reviewLimit = Math.ceil(dailyGoal * (1 - DAILY_WORD_CONFIG.NEW_WORDS_RATIO));
      const reviewsToInclude = dueReviews.slice(0, Math.max(reviewLimit, 5));

      reviewCount = reviewsToInclude.length;

      // Add review flashcards
      for (const progress of reviewsToInclude) {
        const flashcard = await this.getFlashcardById(progress.flashcard_id);
        if (flashcard) {
          selectedFlashcards.push(flashcard);
        }
      }
    }

    // Step 2: Add new words to reach daily goal
    const newWordsNeeded = dailyGoal - reviewCount;

    if (newWordsNeeded > 0) {
      const newWords = await this.selectNewWords(
        userId,
        currentLevel,
        newWordsNeeded
      );
      selectedFlashcards.push(...newWords);
    }

    // Step 3: Create daily word records
    const dailyWords: Omit<DailyWord, 'id' | 'created_at'>[] = selectedFlashcards.map(
      (flashcard) => ({
        user_id: userId,
        flashcard_id: flashcard.id,
        date: today,
        completed: false,
      })
    );

    // Save to database
    const created = await dailyWordsService.createDailyWords(dailyWords);
    return created;
  },

  /**
   * Select new words based on difficulty progression
   */
  async selectNewWords(
    userId: string,
    currentLevel: DifficultyLevel,
    count: number
  ): Promise<Flashcard[]> {
    // Get user's learning progress
    const userProgress = await progressService.getUserProgress(userId);
    const learnedFlashcardIds = new Set(userProgress.map((p) => p.flashcard_id));

    // Get flashcards at current level
    let availableCards = await flashcardService.getFlashcardsByDifficulty(currentLevel);

    // Filter out already learned words
    availableCards = availableCards.filter(
      (card) => !learnedFlashcardIds.has(card.id)
    );

    // If not enough cards at current level, get from next level
    if (availableCards.length < count) {
      const nextLevel = this.getNextLevel(currentLevel);
      if (nextLevel) {
        const nextLevelCards = await flashcardService.getFlashcardsByDifficulty(
          nextLevel
        );
        const filteredNextLevel = nextLevelCards.filter(
          (card) => !learnedFlashcardIds.has(card.id)
        );
        availableCards = [...availableCards, ...filteredNextLevel];
      }
    }

    // Shuffle and select
    const shuffled = this.shuffleArray(availableCards);
    return shuffled.slice(0, count);
  },

  /**
   * Get next CEFR level
   */
  getNextLevel(current: DifficultyLevel): DifficultyLevel | null {
    const levels: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(current);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  },

  /**
   * Get previous CEFR level
   */
  getPreviousLevel(current: DifficultyLevel): DifficultyLevel | null {
    const levels: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(current);
    return currentIndex > 0 ? levels[currentIndex - 1] : null;
  },

  /**
   * Determine if user should progress to next level
   */
  async shouldProgressLevel(userId: string, currentLevel: DifficultyLevel): Promise<boolean> {
    const progressAtLevel = await progressService.getUserProgress(userId);

    // Filter progress for current level cards
    const currentLevelCards = await flashcardService.getFlashcardsByDifficulty(currentLevel);
    const currentLevelIds = new Set(currentLevelCards.map((c) => c.id));

    const currentLevelProgress = progressAtLevel.filter((p) =>
      currentLevelIds.has(p.flashcard_id)
    );

    if (currentLevelProgress.length === 0) return false;

    // Check if at least 80% of current level words are familiar or mastered
    const masteredOrFamiliar = currentLevelProgress.filter(
      (p) => p.status === 'familiar' || p.status === 'mastered'
    ).length;

    const masteryRate = masteredOrFamiliar / currentLevelProgress.length;
    return masteryRate >= 0.8;
  },

  /**
   * Get flashcard by ID
   */
  async getFlashcardById(id: string): Promise<Flashcard | null> {
    try {
      const { data, error } = await flashcardService.getSharedFlashcards(1);
      // This is a simplified version - in production, fetch by specific ID
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Get completion rate for today
   */
  async getTodayCompletionRate(userId: string): Promise<number> {
    const todayWords = await dailyWordsService.getTodayWords(userId);
    if (todayWords.length === 0) return 0;

    const completed = todayWords.filter((w) => w.completed).length;
    return (completed / todayWords.length) * 100;
  },

  /**
   * Get study statistics for the past N days
   */
  async getStudyStatistics(userId: string, days: number = 7) {
    const history = await dailyWordsService.getWordsHistory(userId, days);

    const stats = {
      totalWords: history.length,
      completedWords: history.filter((w) => w.completed).length,
      completionRate: 0,
      averageRating: 0,
      studyDays: new Set(history.map((w) => w.date)).size,
    };

    if (stats.totalWords > 0) {
      stats.completionRate = (stats.completedWords / stats.totalWords) * 100;
    }

    const ratedWords = history.filter((w) => w.rating !== null && w.rating !== undefined);
    if (ratedWords.length > 0) {
      const totalRating = ratedWords.reduce((sum, w) => sum + (w.rating || 0), 0);
      stats.averageRating = totalRating / ratedWords.length;
    }

    return stats;
  },
};
