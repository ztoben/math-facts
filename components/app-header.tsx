import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

interface AppHeaderProps {
  title?: string;
  showIcon?: boolean;
}

export function AppHeader({ title = 'Math Facts', showIcon = true }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {showIcon && (
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
  icon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});
