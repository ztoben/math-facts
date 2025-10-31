import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { NumberPad } from '@/components/number-pad';
import { useGame, OperationType } from '@/contexts/game-context';

interface Question {
  num1: number;
  num2: number;
  operation: OperationType;
  correctAnswer: number;
}

export default function GameScreen() {
  const { settings, getNumberRange } = useGame();
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateQuestion = (): Question => {
    const { min, max } = getNumberRange();
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let correctAnswer = 0;

    switch (settings.operation) {
      case 'addition':
        correctAnswer = num1 + num2;
        break;
      case 'subtraction':
        // Ensure num1 is always greater for positive results
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        correctAnswer = num1 - num2;
        break;
      case 'multiplication':
        correctAnswer = num1 * num2;
        break;
      case 'division':
        // Ensure clean division
        correctAnswer = num1;
        num1 = num1 * num2;
        break;
    }

    return { num1, num2, operation: settings.operation, correctAnswer };
  };

  useEffect(() => {
    setQuestion(generateQuestion());
  }, []);

  const handleNumberPress = (num: number) => {
    setUserAnswer((prev) => prev + num.toString());
  };

  const handleBackspace = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!question || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === question.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setQuestionsAnswered((prev) => prev + 1);

    // Show feedback briefly, then move to next question or results
    setTimeout(() => {
      if (questionsAnswered + 1 >= 10) {
        // Game over after 10 questions
        router.push({
          pathname: '/results',
          params: { score: score + (isCorrect ? 1 : 0), total: 10 },
        });
      } else {
        // Next question
        setQuestion(generateQuestion());
        setUserAnswer('');
        setFeedback(null);
      }
    }, 1000);
  };

  const getOperationSymbol = (operation: OperationType) => {
    switch (operation) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '−';
      case 'multiplication':
        return '×';
      case 'division':
        return '÷';
    }
  };

  const goHome = () => {
    router.push('/');
  };

  if (!question) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goHome} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {score}/{questionsAnswered}
          </Text>
          <Text style={styles.progressText}>
            Question {questionsAnswered + 1}/10
          </Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.num1} {getOperationSymbol(question.operation)} {question.num2} = ?
        </Text>

        <View style={styles.answerDisplay}>
          <Text style={styles.answerText}>{userAnswer || '_'}</Text>
        </View>

        {feedback && (
          <View
            style={[
              styles.feedbackContainer,
              feedback === 'correct' ? styles.correctFeedback : styles.incorrectFeedback,
            ]}>
            <Text style={styles.feedbackText}>
              {feedback === 'correct' ? '✓ Correct!' : `✗ Wrong! Answer: ${question.correctAnswer}`}
            </Text>
          </View>
        )}
      </View>

      <NumberPad
        onNumberPress={handleNumberPress}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  homeButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  progressText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 40,
  },
  answerDisplay: {
    minWidth: 200,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1a1a1a',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  answerText: {
    fontSize: 48,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  feedbackContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  correctFeedback: {
    backgroundColor: '#90EE90',
  },
  incorrectFeedback: {
    backgroundColor: '#FFB6C1',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});
