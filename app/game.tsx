import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
import { NumberPad } from '@/components/number-pad';
import { CountdownBar } from '@/components/countdown-bar';
import { useGame, OperationType } from '@/contexts/game-context';

interface Question {
  num1: number;
  num2: number;
  operation: OperationType;
  correctAnswer: number;
}

export default function GameScreen() {
  const { settings, getNumberRange } = useGame();

  // Timer duration based on difficulty
  const getAnswerTime = () => {
    switch (settings.difficulty) {
      case 'easy':
        return 15000; // 15 seconds
      case 'medium':
        return 10000; // 10 seconds
      case 'hard':
        return 7000; // 7 seconds
      default:
        return 10000;
    }
  };

  const ANSWER_TIME = getAnswerTime();
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const questionStartTime = useRef<number>(Date.now());
  const lastInputTime = useRef<number>(0);
  const lastInputValue = useRef<number | null>(null);

  // Animation values
  const answerScale = useSharedValue(1);
  const answerShake = useSharedValue(0);
  const answerBackgroundColor = useSharedValue('#ffffff');

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
    questionStartTime.current = Date.now();
    setIsTimerActive(true);
  }, []);

  const resetForNextQuestion = () => {
    setQuestion(generateQuestion());
    setUserAnswer('');
    setIsTimerActive(true);
    setHasAttempted(false);
    setIsInputDisabled(false);
    questionStartTime.current = Date.now();
    answerBackgroundColor.value = '#ffffff';
    answerScale.value = 1;
    answerShake.value = 0;
  };

  const handleNumberPress = (num: number) => {
    if (isInputDisabled) return;

    const now = Date.now();
    // Debounce: ignore if same number pressed within 50ms
    if (lastInputValue.current === num && now - lastInputTime.current < 50) {
      return;
    }

    lastInputTime.current = now;
    lastInputValue.current = num;
    setUserAnswer((prev) => prev + num.toString());
  };

  const handleBackspace = () => {
    if (isInputDisabled) return;
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const calculatePoints = (timeElapsed: number): number => {
    // Max 4 points if answered quickly
    // 1 point if time expired
    if (timeElapsed > ANSWER_TIME) {
      return 1;
    }

    const percentage = timeElapsed / ANSWER_TIME;
    if (percentage <= 0.25) return 4; // First 25% of time
    if (percentage <= 0.5) return 3; // 25-50%
    if (percentage <= 0.75) return 2; // 50-75%
    return 1; // 75-100%
  };

  const handleSubmit = () => {
    if (!question || userAnswer === '' || isInputDisabled) return;

    // Disable input until answer is cleared or next question
    setIsInputDisabled(true);

    const isCorrect = parseInt(userAnswer) === question.correctAnswer;

    if (isCorrect) {
      // Only stop timer and award points on first attempt
      if (!hasAttempted) {
        setIsTimerActive(false);
        const timeElapsed = Date.now() - questionStartTime.current;
        const points = calculatePoints(timeElapsed);
        setScore((prev) => prev + points);
        setQuestionsAnswered((prev) => prev + 1);
      }

      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((max) => Math.max(max, newStreak));
        return newStreak;
      });

      // Animate correct answer - green background and scale
      answerBackgroundColor.value = withTiming('#90EE90', { duration: 300 });
      answerScale.value = withSequence(
        withSpring(1.15, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );

      // Move to next question after showing animation
      setTimeout(() => {
        const newQuestionsAnswered = questionsAnswered + 1;

        // End game if:
        // - Completed at least 15 questions AND
        // - This was a retry (hasAttempted = true), meaning the streak was broken
        const shouldEndGame = newQuestionsAnswered >= 15 && hasAttempted;

        if (shouldEndGame) {
          // Game over - completed at least 15 questions and streak was broken
          router.push({
            pathname: '/results',
            params: {
              score,
              questionsAnswered: newQuestionsAnswered,
              maxStreak,
              operation: settings.operation,
              difficulty: settings.difficulty,
            },
          });
        } else {
          // Next question
          resetForNextQuestion();
        }
      }, 1000);
    } else {
      // Wrong answer - let them try again
      if (!hasAttempted) {
        setIsTimerActive(false);
        setHasAttempted(true);
        setStreak(0);
      }

      // Animate incorrect answer - red background and shake
      answerBackgroundColor.value = withTiming('#FFB6C1', { duration: 300 });
      answerShake.value = withSequence(
        withTiming(-10, { duration: 50, easing: Easing.linear }),
        withTiming(10, { duration: 50, easing: Easing.linear }),
        withTiming(-10, { duration: 50, easing: Easing.linear }),
        withTiming(10, { duration: 50, easing: Easing.linear }),
        withTiming(0, { duration: 50, easing: Easing.linear })
      );

      // Clear their answer and reset the background after animation
      setTimeout(() => {
        setUserAnswer('');
        setIsInputDisabled(false);
        answerBackgroundColor.value = withTiming('#ffffff', { duration: 300 });
      }, 500);
    }
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

  const animatedAnswerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: answerScale.value }, { translateX: answerShake.value }],
      backgroundColor: answerBackgroundColor.value,
    };
  });

  if (!question) return null;

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={goHome} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>← Home</Text>
      </TouchableOpacity>

      <CountdownBar key={questionsAnswered} duration={ANSWER_TIME} isActive={isTimerActive} />

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.progressText}>Question {questionsAnswered + 1}</Text>
        <Text style={[styles.streakText, { opacity: streak > 0 ? 1 : 0 }]}>
          🔥 Streak: {streak}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.num1} {getOperationSymbol(question.operation)} {question.num2} = ?
        </Text>

        <Animated.View style={[styles.answerDisplay, animatedAnswerStyle]}>
          <Text style={styles.answerText}>{userAnswer || ''}</Text>
        </Animated.View>
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  homeButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginLeft: 10,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    minWidth: 250,
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
  streakText: {
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: 'bold',
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
});
