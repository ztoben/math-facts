import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Svg } from 'react-native-svg';
import Rough from 'react-native-rough';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

export function NumberPad({ onNumberPress, onBackspace, onSubmit }: NumberPadProps) {
  const buttonSize = 70;

  const renderButton = (value: string | number, onPress: () => void, isWide = false) => {
    const width = isWide ? buttonSize * 2 + 15 : buttonSize;

    return (
      <TouchableOpacity
        key={value}
        onPress={onPress}
        style={[styles.button, { width, height: buttonSize }]}
        activeOpacity={0.7}>
        <Svg height={buttonSize} width={width} style={StyleSheet.absoluteFill}>
          <Rough.Rectangle
            x={3}
            y={3}
            width={width - 6}
            height={buttonSize - 6}
            fill="#F5F3E7"
            stroke="#1a1a1a"
            strokeWidth={2}
            roughness={1.5}
            bowing={2}
          />
        </Svg>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonText}>{value}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderButton(1, () => onNumberPress(1))}
        {renderButton(2, () => onNumberPress(2))}
        {renderButton(3, () => onNumberPress(3))}
      </View>
      <View style={styles.row}>
        {renderButton(4, () => onNumberPress(4))}
        {renderButton(5, () => onNumberPress(5))}
        {renderButton(6, () => onNumberPress(6))}
      </View>
      <View style={styles.row}>
        {renderButton(7, () => onNumberPress(7))}
        {renderButton(8, () => onNumberPress(8))}
        {renderButton(9, () => onNumberPress(9))}
      </View>
      <View style={styles.row}>
        {renderButton('←', onBackspace)}
        {renderButton(0, () => onNumberPress(0))}
        {renderButton('✓', onSubmit)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 15,
  },
  button: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
