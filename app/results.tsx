import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { HandDrawnButton } from '@/components/hand-drawn-button';
import { ThemedView } from '@/components/themed-view';
import { useStats, type DifficultyType, type GameStats } from '@/contexts/stats-context';
import { OperationType } from '@/contexts/game-context';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const questionsAnswered = parseInt(params.questionsAnswered as string) || 15;
  const maxStreak = parseInt(params.maxStreak as string) || 0;
  const operation = (params.operation as OperationType) || 'addition';
  const difficulty = (params.difficulty as DifficultyType) || 'easy';

  const { updateStats, getStatsForGame } = useStats();
  const [currentStats, setCurrentStats] = useState<GameStats | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isNewHighStreak, setIsNewHighStreak] = useState(false);

  useEffect(() => {
    // Get current stats before updating
    const stats = getStatsForGame(difficulty, operation);
    setIsNewHighScore(score > stats.highestScore);
    setIsNewHighStreak(maxStreak > stats.highestStreak);

    // Update stats
    updateStats(difficulty, operation, score, maxStreak);

    // Get updated stats for display
    const updatedStats = getStatsForGame(difficulty, operation);
    setCurrentStats(updatedStats);
  }, []);

  const total = questionsAnswered * 4; // Max 4 points per question

  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage >= 90) return 'Outstanding! 🌟';
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
          {maxStreak > 0 && (
            <Text style={styles.streakText}>
              🔥 Best Streak: {maxStreak} in a row!
              {isNewHighStreak && ' 🎉 NEW RECORD!'}
            </Text>
          )}
          <Text style={styles.detailText}>
            Operation: {operation.charAt(0).toUpperCase() + operation.slice(1)}
          </Text>
          <Text style={styles.detailText}>
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Text>
          {currentStats && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsHeader}>Your Records ({difficulty} {operation}):</Text>
              <Text style={styles.statsText}>
                High Score: {currentStats.highestScore} {isNewHighScore && '⭐ NEW!'}
              </Text>
              <Text style={styles.statsText}>
                High Streak: {currentStats.highestStreak}
              </Text>
              <Text style={styles.statsText}>Games Played: {currentStats.gamesPlayed}</Text>
            </View>
          )}
          <Text style={styles.hintText}>
            Faster answers = more points! (Max 4 per question)
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
  streakText: {
    fontSize: 22,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hintText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 10,
  },
  statsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFEF5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    alignItems: 'center',
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
});
