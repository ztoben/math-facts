import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface CountdownBarProps {
  duration: number; // in milliseconds
  onComplete?: () => void;
  isActive: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH - 40;

export function CountdownBar({ duration, onComplete, isActive }: CountdownBarProps) {
  const progress = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      progress.value = 1;
      progress.value = withTiming(
        0,
        {
          duration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished && onComplete) {
            onComplete();
          }
        }
      );
    }
  }, [isActive, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: progress.value * BAR_WIDTH,
    };
  });

  const getBarColor = useAnimatedStyle(() => {
    // Green zone: 100% - 50%, Yellow zone: last 50%
    const backgroundColor = progress.value > 0.5 ? '#4CAF50' : '#FFC107';
    return { backgroundColor };
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, animatedStyle, getBarColor]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
