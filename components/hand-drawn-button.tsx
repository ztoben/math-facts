import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Svg } from 'react-native-svg';
import Rough from 'react-native-rough';

interface HandDrawnButtonProps {
  onPress: () => void;
  title: string;
  width?: number;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
  selected?: boolean;
}

export function HandDrawnButton({
  onPress,
  title,
  width = 200,
  height = 80,
  fontSize = 24,
  disabled = false,
  selected = false,
}: HandDrawnButtonProps) {
  const scale = useSharedValue(1);
  const fillColor = selected ? '#E8F5E9' : '#F5F3E7';
  const strokeColor = selected ? '#4CAF50' : '#1a1a1a';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[styles.container, { width, height }]}>
      <Animated.View style={[styles.svgContainer, animatedStyle]}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          <Rough.Rectangle
            x={5}
            y={5}
            width={width - 10}
            height={height - 10}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={2.5}
            roughness={1.5}
            bowing={2}
          />
        </Svg>
        <View style={styles.textContainer}>
          <Text style={[styles.text, { fontSize }]}>
            {title}{selected ? ' ✓' : ''}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
