import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Svg } from 'react-native-svg';
import Rough from 'react-native-rough';

interface HandDrawnButtonProps {
  onPress: () => void;
  title: string;
  width?: number;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
}

export function HandDrawnButton({
  onPress,
  title,
  width = 200,
  height = 80,
  fontSize = 24,
  disabled = false,
}: HandDrawnButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, { width, height }]}
      activeOpacity={0.7}>
      <View style={styles.svgContainer}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          <Rough.Rectangle
            x={5}
            y={5}
            width={width - 10}
            height={height - 10}
            fill="#F5F3E7"
            stroke="#1a1a1a"
            strokeWidth={2.5}
            roughness={1.5}
            bowing={2}
          />
        </Svg>
        <View style={styles.textContainer}>
          <Text style={[styles.text, { fontSize }]}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
