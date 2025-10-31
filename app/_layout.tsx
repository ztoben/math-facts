import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GameProvider } from '@/contexts/game-context';
import { StatsProvider } from '@/contexts/stats-context';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StatsProvider>
      <GameProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F5F3E7',
            },
            headerTintColor: '#1a1a1a',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="index"
            options={{
              title: '',
              headerLeft: () => (
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={{ width: 32, height: 32, marginLeft: 10, marginRight: 10 }}
                  resizeMode="contain"
                />
              ),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.push('/settings')}
                  style={{ padding: 10, marginRight: 10 }}>
                  <Text style={{ fontSize: 18, color: '#1a1a1a', fontWeight: '600' }}>
                    ⚙ Settings
                  </Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerLeft: () => (
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={{ width: 32, height: 32, marginLeft: 10, marginRight: 10 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Stack.Screen
            name="game"
            options={{
              title: 'Math Facts',
              headerLeft: () => (
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={{ width: 32, height: 32, marginLeft: 10, marginRight: 10 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Stack.Screen name="results" options={{ title: 'Results' }} />
        </Stack>
        <StatusBar style="dark" />
        </ThemeProvider>
      </GameProvider>
    </StatsProvider>
  );
}
