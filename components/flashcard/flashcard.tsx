import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Flashcard as FlashcardType } from '@/types';
import { WORD_TYPES } from '@/constants/vocabulary';
import { Ionicons } from '@expo/vector-icons';

interface FlashcardProps {
  flashcard: FlashcardType;
  onComplete?: (rating: number) => void;
  showActions?: boolean;
}

export function Flashcard({ flashcard, onComplete, showActions = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const handleFlip = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1,
      rate: 0.85,
    });
  };

  const handleRating = (rating: number) => {
    onComplete?.(rating);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const wordType = WORD_TYPES[flashcard.type];

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Pressable onPress={handleFlip} style={styles.cardPressable}>
          {/* Front of card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: wordType.color }]}>
                <Text style={styles.badgeText}>{wordType.name_zh}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleSpeak(flashcard.word)}
                style={styles.speakerButton}
              >
                <Ionicons name="volume-high" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.word}>{flashcard.word}</Text>
              {flashcard.phonetic && (
                <Text style={styles.phonetic}>{flashcard.phonetic}</Text>
              )}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.hint}>點擊查看翻譯</Text>
            </View>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: wordType.color }]}>
                <Text style={styles.badgeText}>{wordType.name_zh}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.word}>{flashcard.word}</Text>

              <View style={styles.definitionContainer}>
                <Text style={styles.definition}>{flashcard.definition_zh}</Text>
                <Text style={styles.definitionEn}>{flashcard.definition_en}</Text>
              </View>

              {flashcard.examples.length > 0 && (
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleLabel}>例句：</Text>
                  <View style={styles.exampleRow}>
                    <Text style={styles.exampleEn}>
                      {flashcard.examples[0].sentence_en}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleSpeak(flashcard.examples[0].sentence_en)}
                      style={styles.smallSpeakerButton}
                    >
                      <Ionicons name="volume-medium" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.exampleZh}>
                    {flashcard.examples[0].sentence_zh}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.hint}>點擊返回</Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {showActions && isFlipped && (
        <View style={styles.actions}>
          <Text style={styles.actionsTitle}>這個單字對你來說：</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionHard]}
              onPress={() => handleRating(2)}
            >
              <Text style={styles.actionButtonText}>困難</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionGood]}
              onPress={() => handleRating(4)}
            >
              <Text style={styles.actionButtonText}>還行</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionEasy]}
              onPress={() => handleRating(5)}
            >
              <Text style={styles.actionButtonText}>簡單</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  cardPressable: {
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backfaceVisibility: 'hidden',
  },
  cardFront: {},
  cardBack: {},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  speakerButton: {
    padding: 8,
  },
  smallSpeakerButton: {
    padding: 4,
    marginLeft: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  phonetic: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  definitionContainer: {
    width: '100%',
    marginTop: 20,
  },
  definition: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  definitionEn: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  exampleContainer: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  exampleEn: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  exampleZh: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardFooter: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#999',
  },
  actions: {
    width: '100%',
    marginTop: 20,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionHard: {
    backgroundColor: '#FF3B30',
  },
  actionGood: {
    backgroundColor: '#FF9500',
  },
  actionEasy: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
