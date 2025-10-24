import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Flashcard as FlashcardComponent } from '@/components/flashcard/flashcard';
import { dailyWordsService, flashcardService, statsService } from '@/services/database';
import { useAuthStore } from '@/lib/auth-store';
import { Flashcard, DailyWord } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, profile } = useAuthStore();
  const [dailyWords, setDailyWords] = useState<DailyWord[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDailyWords = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const words = await dailyWordsService.getTodayWords(user.id);
      setDailyWords(words);

      // Load flashcards for daily words
      const flashcardPromises = words.map((word) =>
        flashcardService.getFlashcardById(word.flashcard_id)
      );
      const loadedFlashcards = await Promise.all(flashcardPromises);
      setFlashcards(loadedFlashcards);

      // Find first uncompleted word
      const firstUncompleted = words.findIndex((w) => !w.completed);
      setCurrentIndex(firstUncompleted !== -1 ? firstUncompleted : 0);
    } catch (error) {
      console.error('Error loading daily words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDailyWords();
    setRefreshing(false);
  };

  const handleComplete = async (rating: number) => {
    if (!user || currentIndex >= dailyWords.length) return;

    const currentWord = dailyWords[currentIndex];

    try {
      // Mark word as completed
      await dailyWordsService.markWordCompleted(currentWord.id, rating);

      // Update local state
      const updatedWords = [...dailyWords];
      updatedWords[currentIndex] = {
        ...currentWord,
        completed: true,
        rating,
      };
      setDailyWords(updatedWords);

      // Update streak
      await statsService.updateStreak(user.id);

      // Move to next word
      if (currentIndex < dailyWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error completing word:', error);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < dailyWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    loadDailyWords();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const completedCount = dailyWords.filter((w) => w.completed).length;
  const totalCount = dailyWords.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          你好，{profile?.display_name || 'Student'}！
        </Text>
        <Text style={styles.subtitle}>今日學習目標</Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>今日進度</Text>
          <Text style={styles.progressText}>
            {completedCount} / {totalCount}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {flashcards.length > 0 && currentIndex < flashcards.length ? (
        <>
          <View style={styles.cardCounter}>
            <Text style={styles.cardCounterText}>
              單字 {currentIndex + 1} / {flashcards.length}
            </Text>
          </View>

          <FlashcardComponent
            flashcard={flashcards[currentIndex]}
            onComplete={handleComplete}
            showActions={!dailyWords[currentIndex]?.completed}
          />

          <View style={styles.navigation}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === 0 && styles.navButtonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentIndex === 0 ? '#ccc' : '#007AFF'}
              />
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                上一個
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === flashcards.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentIndex === flashcards.length - 1 &&
                    styles.navButtonTextDisabled,
                ]}
              >
                下一個
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={
                  currentIndex === flashcards.length - 1 ? '#ccc' : '#007AFF'
                }
              />
            </TouchableOpacity>
          </View>

          {dailyWords[currentIndex]?.completed && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.completedText}>已完成</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#34C759" />
          <Text style={styles.emptyTitle}>太棒了！</Text>
          <Text style={styles.emptyText}>
            你已經完成今天所有的單字學習
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  cardCounter: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCounterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  completedText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
