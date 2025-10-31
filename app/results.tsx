import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { HandDrawnButton } from '@/components/hand-drawn-button';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/contexts/game-context';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const total = parseInt(params.total as string) || 10;
  const { settings } = useGame();

  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect! 🌟';
    if (percentage >= 80) return 'Great job! 🎉';
    if (percentage >= 60) return 'Good work! 👍';
    if (percentage >= 40) return 'Keep practicing! 💪';
    return 'Try again! 📚';
  };

  const handlePlayAgain = () => {
    router.push('/game');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Results</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {score} / {total}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>

        <Text style={styles.message}>{getMessage()}</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Operation: {settings.operation.charAt(0).toUpperCase() + settings.operation.slice(1)}
          </Text>
          <Text style={styles.detailText}>
            Difficulty: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <HandDrawnButton
            title="Play Again"
            onPress={handlePlayAgain}
            width={250}
            height={80}
            fontSize={24}
          />
          <HandDrawnButton
            title="Home"
            onPress={handleGoHome}
            width={250}
            height={80}
            fontSize={24}
          />
        </View>
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 30,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 30,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  detailText: {
    fontSize: 18,
    color: '#555',
    marginVertical: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
});
