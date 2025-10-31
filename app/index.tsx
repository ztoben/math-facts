import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { HandDrawnButton } from '@/components/hand-drawn-button';
import { ThemedView } from '@/components/themed-view';
import { useGame, OperationType } from '@/contexts/game-context';

export default function HomeScreen() {
  const { setOperation } = useGame();

  const handleOperationSelect = (operation: OperationType) => {
    setOperation(operation);
    router.push('/game');
  };

  const goToSettings = () => {
    router.push('/settings');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Math Facts</Text>
        <Text style={styles.subtitle}>Choose an operation to practice</Text>
      </View>

      <View style={styles.buttonContainer}>
        <HandDrawnButton
          title="Addition +"
          onPress={() => handleOperationSelect('addition')}
          width={280}
          height={90}
          fontSize={28}
        />
        <HandDrawnButton
          title="Subtraction −"
          onPress={() => handleOperationSelect('subtraction')}
          width={280}
          height={90}
          fontSize={28}
        />
        <HandDrawnButton
          title="Multiplication ×"
          onPress={() => handleOperationSelect('multiplication')}
          width={280}
          height={90}
          fontSize={28}
        />
        <HandDrawnButton
          title="Division ÷"
          onPress={() => handleOperationSelect('division')}
          width={280}
          height={90}
          fontSize={28}
        />
      </View>

      <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
        <Text style={styles.settingsText}>⚙ Settings</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
  },
  settingsText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
