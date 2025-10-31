import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { HandDrawnButton } from '@/components/hand-drawn-button';
import { ThemedView } from '@/components/themed-view';
import { useGame, Difficulty } from '@/contexts/game-context';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { settings, setDifficulty } = useGame();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    router.back();
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
            />
            <Text style={styles.description}>{getDifficultyDescription('easy')}</Text>
            {isSelected('easy') && <Text style={styles.selectedIndicator}>✓ Selected</Text>}
          </View>

          <View style={styles.optionContainer}>
            <HandDrawnButton
              title="Medium"
              onPress={() => handleDifficultySelect('medium')}
              width={250}
              height={80}
              fontSize={24}
            />
            <Text style={styles.description}>{getDifficultyDescription('medium')}</Text>
            {isSelected('medium') && <Text style={styles.selectedIndicator}>✓ Selected</Text>}
          </View>

          <View style={styles.optionContainer}>
            <HandDrawnButton
              title="Hard"
              onPress={() => handleDifficultySelect('hard')}
              width={250}
              height={80}
              fontSize={24}
            />
            <Text style={styles.description}>{getDifficultyDescription('hard')}</Text>
            {isSelected('hard') && <Text style={styles.selectedIndicator}>✓ Selected</Text>}
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
  selectedIndicator: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginTop: 5,
  },
  currentSettings: {
    fontSize: 16,
    color: '#333',
    marginTop: 40,
    textAlign: 'center',
  },
});
