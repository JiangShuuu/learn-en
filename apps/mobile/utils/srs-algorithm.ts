import { LearningProgress, LearningStatus, ReviewResult } from '@/types';
import { SRS_CONFIG } from '@/constants/vocabulary';

/**
 * SM-2 Algorithm for Spaced Repetition
 * Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * Quality ratings:
 * 5 - Perfect response
 * 4 - Correct response after some hesitation
 * 3 - Correct response with difficulty
 * 2 - Incorrect response; correct answer seemed easy to recall
 * 1 - Incorrect response; correct answer seemed familiar
 * 0 - Complete blackout
 */

interface SRSCalculationResult {
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  status: LearningStatus;
}

export const srsAlgorithm = {
  /**
   * Calculate next review date based on quality rating
   */
  calculateNextReview(
    currentProgress: LearningProgress | null,
    quality: number // 0-5
  ): SRSCalculationResult {
    // Validate quality
    if (quality < 0 || quality > 5) {
      throw new Error('Quality must be between 0 and 5');
    }

    // Initialize values for new card
    let easeFactor = currentProgress?.ease_factor || SRS_CONFIG.INITIAL_EASE_FACTOR;
    let interval = currentProgress?.interval || 0;
    let repetitions = currentProgress?.repetitions || 0;

    // If quality < 3, reset the card
    if (quality < SRS_CONFIG.QUALITY_THRESHOLD) {
      repetitions = 0;
      interval = SRS_CONFIG.INITIAL_INTERVAL;
    } else {
      // Calculate new ease factor
      const adjustment = SRS_CONFIG.EASE_FACTOR_ADJUSTMENT[quality as keyof typeof SRS_CONFIG.EASE_FACTOR_ADJUSTMENT] || 0;
      easeFactor = Math.max(
        SRS_CONFIG.MIN_EASE_FACTOR,
        easeFactor + adjustment
      );

      // Calculate new interval based on repetition number
      if (repetitions === 0) {
        interval = SRS_CONFIG.INITIAL_INTERVAL; // 1 day
      } else if (repetitions === 1) {
        interval = 6; // 6 days
      } else {
        interval = Math.round(interval * easeFactor);
      }

      repetitions += 1;
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    // Determine learning status
    let status: LearningStatus = 'learning';
    if (repetitions === 0) {
      status = 'new';
    } else if (repetitions >= 3 && interval >= 21) {
      status = 'mastered';
    } else if (repetitions >= 2) {
      status = 'familiar';
    }

    return {
      ease_factor: easeFactor,
      interval,
      repetitions,
      next_review: nextReviewDate.toISOString(),
      status,
    };
  },

  /**
   * Get recommended quality rating based on user response time
   * This can be used as a helper for automatic rating
   */
  getSuggestedQuality(responseTimeMs: number, wasCorrect: boolean): number {
    if (!wasCorrect) {
      return responseTimeMs < 3000 ? 2 : 1; // Quick wrong answer vs slow
    }

    // Correct answer - rate based on speed
    if (responseTimeMs < 2000) {
      return 5; // Very fast
    } else if (responseTimeMs < 5000) {
      return 4; // Reasonably fast
    } else {
      return 3; // Slow but correct
    }
  },

  /**
   * Determine if a flashcard is due for review
   */
  isDue(progress: LearningProgress): boolean {
    if (!progress.next_review) return true;
    return new Date(progress.next_review) <= new Date();
  },

  /**
   * Get the number of days until next review
   */
  getDaysUntilReview(progress: LearningProgress): number {
    if (!progress.next_review) return 0;

    const now = new Date();
    const nextReview = new Date(progress.next_review);
    const diffMs = nextReview.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  },

  /**
   * Calculate retention rate based on reviews
   */
  calculateRetentionRate(reviews: ReviewResult[]): number {
    if (reviews.length === 0) return 0;

    const successfulReviews = reviews.filter(
      (r) => r.quality >= SRS_CONFIG.QUALITY_THRESHOLD
    ).length;

    return (successfulReviews / reviews.length) * 100;
  },

  /**
   * Get recommended study session size based on due cards
   */
  getRecommendedSessionSize(dueCount: number, availableTime: number): number {
    // Assume 1 minute per card
    const timeBasedLimit = availableTime;

    // Don't overwhelm user
    const maxPerSession = 50;

    return Math.min(dueCount, timeBasedLimit, maxPerSession);
  },

  /**
   * Prioritize cards for review
   * Returns sorted array with most important cards first
   */
  prioritizeReviews(progressList: LearningProgress[]): LearningProgress[] {
    return progressList.sort((a, b) => {
      // Priority 1: Overdue cards (oldest first)
      const aOverdue = a.next_review ? new Date(a.next_review) < new Date() : false;
      const bOverdue = b.next_review ? new Date(b.next_review) < new Date() : false;

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Priority 2: By next review date (earliest first)
      if (a.next_review && b.next_review) {
        return new Date(a.next_review).getTime() - new Date(b.next_review).getTime();
      }

      // Priority 3: New cards
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (a.status !== 'new' && b.status === 'new') return 1;

      return 0;
    });
  },

  /**
   * Calculate optimal daily goal based on user's performance
   */
  calculateOptimalDailyGoal(
    currentGoal: number,
    avgRetentionRate: number,
    avgCompletionRate: number
  ): number {
    // If retention is high (>80%) and completion is high (>90%), increase goal
    if (avgRetentionRate > 80 && avgCompletionRate > 90) {
      return Math.min(currentGoal + 5, 50); // Max 50 cards per day
    }

    // If retention is low (<60%) or completion is low (<70%), decrease goal
    if (avgRetentionRate < 60 || avgCompletionRate < 70) {
      return Math.max(currentGoal - 5, 10); // Min 10 cards per day
    }

    // Otherwise keep current goal
    return currentGoal;
  },
};
