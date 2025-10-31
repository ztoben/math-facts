import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { HandDrawnButton } from '@/components/hand-drawn-button';
import { ThemedView } from '@/components/themed-view';
import { useGame, Difficulty } from '@/contexts/game-context';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { settings, setDifficulty } = useGame();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
  };

  const goHome = () => {
    router.push('/');
  };

  const getDifficultyDescription = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Numbers 1-10';
      case 'medium':
        return 'Numbers 1-20';
      case 'hard':
        return 'Numbers 1-100';
    }
  };

  const isSelected = (difficulty: Difficulty) => settings.difficulty === difficulty;

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={goHome} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>← Home</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Difficulty</Text>

        <View style={styles.buttonContainer}>
          <View style={styles.optionContainer}>
            <HandDrawnButton
              title="Easy"
              onPress={() => handleDifficultySelect('easy')}
              width={250}
              height={80}
              fontSize={24}
              selected={isSelected('easy')}
            />
            <Text style={styles.description}>{getDifficultyDescription('easy')}</Text>
          </View>

          <View style={styles.optionContainer}>
            <HandDrawnButton
              title="Medium"
              onPress={() => handleDifficultySelect('medium')}
              width={250}
              height={80}
              fontSize={24}
              selected={isSelected('medium')}
            />
            <Text style={styles.description}>{getDifficultyDescription('medium')}</Text>
          </View>

          <View style={styles.optionContainer}>
            <HandDrawnButton
              title="Hard"
              onPress={() => handleDifficultySelect('hard')}
              width={250}
              height={80}
              fontSize={24}
              selected={isSelected('hard')}
            />
            <Text style={styles.description}>{getDifficultyDescription('hard')}</Text>
          </View>
        </View>

        <Text style={styles.currentSettings}>
          Current: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)} (
          {getDifficultyDescription(settings.difficulty)})
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  homeButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 10,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  optionContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  currentSettings: {
    fontSize: 16,
    color: '#333',
    marginTop: 40,
    textAlign: 'center',
  },
});
