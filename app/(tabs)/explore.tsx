import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { flashcardService } from '@/services/database';
import { useAuthStore } from '@/lib/auth-store';
import { Flashcard, DifficultyLevel } from '@/types';
import { CEFR_LEVELS, WORD_TYPES } from '@/constants/vocabulary';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const DIFFICULTY_FILTERS: (DifficultyLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ExploreScreen() {
  const { user } = useAuthStore();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const loadFlashcards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const cards = await flashcardService.getSharedFlashcards();
      setFlashcards(cards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFlashcards();
    setRefreshing(false);
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1,
      rate: 0.85,
    });
  };

  useEffect(() => {
    loadFlashcards();
  }, [user]);

  const filteredFlashcards = selectedDifficulty === 'all'
    ? flashcards
    : flashcards.filter(card => card.difficulty_level === selectedDifficulty);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderFlashcard = ({ item }: { item: Flashcard }) => {
    const wordType = WORD_TYPES[item.type];
    const difficultyInfo = CEFR_LEVELS[item.difficulty_level];

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: wordType.color }]}>
            <Text style={styles.badgeText}>{wordType.name_zh}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty_level) }]}>
            <Text style={styles.badgeText}>{item.difficulty_level}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.wordRow}>
            <Text style={styles.cardWord}>{item.word}</Text>
            <TouchableOpacity
              onPress={() => handleSpeak(item.word)}
              style={styles.speakerIcon}
            >
              <Ionicons name="volume-medium" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          {item.phonetic && (
            <Text style={styles.cardPhonetic}>{item.phonetic}</Text>
          )}
          <Text style={styles.cardDefinition} numberOfLines={2}>
            {item.definition_zh}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>
            {item.examples.length} 個例句
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>單字庫</Text>
        <Text style={styles.subtitle}>共 {filteredFlashcards.length} 個單字</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {DIFFICULTY_FILTERS.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton,
              selectedDifficulty === level && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDifficulty === level && styles.filterButtonTextActive,
              ]}
            >
              {level === 'all' ? '全部' : level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredFlashcards}
        renderItem={renderFlashcard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>尚無單字</Text>
          </View>
        }
      />
    </View>
  );
}

function getDifficultyColor(level: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    A1: '#34C759',
    A2: '#30D158',
    B1: '#FF9500',
    B2: '#FF9F0A',
    C1: '#FF3B30',
    C2: '#FF453A',
  };
  return colors[level];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  speakerIcon: {
    padding: 4,
  },
  cardPhonetic: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardDefinition: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
  },
  cardFooterText: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});
