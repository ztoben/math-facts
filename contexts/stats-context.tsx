import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OperationType } from './game-context';

export type DifficultyType = 'easy' | 'medium' | 'hard';

export interface GameStats {
  highestScore: number;
  highestStreak: number;
  gamesPlayed: number;
}

type StatsKey = `${DifficultyType}-${OperationType}`;

interface StatsContextType {
  stats: Record<StatsKey, GameStats>;
  updateStats: (
    difficulty: DifficultyType,
    operation: OperationType,
    score: number,
    streak: number
  ) => Promise<void>;
  getStatsForGame: (difficulty: DifficultyType, operation: OperationType) => GameStats;
}

const STORAGE_KEY = '@ez_math_facts_stats';

const defaultStats: GameStats = {
  highestScore: 0,
  highestStreak: 0,
  gamesPlayed: 0,
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Record<StatsKey, GameStats>>({} as Record<StatsKey, GameStats>);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stats from AsyncStorage on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const storedStats = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading stats:', error);
      setIsLoaded(true);
    }
  };

  const saveStats = async (newStats: Record<StatsKey, GameStats>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const updateStats = async (
    difficulty: DifficultyType,
    operation: OperationType,
    score: number,
    streak: number
  ) => {
    const key: StatsKey = `${difficulty}-${operation}`;
    const currentStats = stats[key] || defaultStats;

    const newStats = {
      ...stats,
      [key]: {
        highestScore: Math.max(currentStats.highestScore, score),
        highestStreak: Math.max(currentStats.highestStreak, streak),
        gamesPlayed: currentStats.gamesPlayed + 1,
      },
    };

    setStats(newStats);
    await saveStats(newStats);
  };

  const getStatsForGame = (difficulty: DifficultyType, operation: OperationType): GameStats => {
    const key: StatsKey = `${difficulty}-${operation}`;
    return stats[key] || defaultStats;
  };

  if (!isLoaded) {
    return null; // Could show a loading screen here
  }

  return (
    <StatsContext.Provider value={{ stats, updateStats, getStatsForGame }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
