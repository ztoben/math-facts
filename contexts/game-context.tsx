import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface GameSettings {
  operation: OperationType;
  difficulty: Difficulty;
}

interface GameContextType {
  settings: GameSettings;
  setOperation: (operation: OperationType) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  getNumberRange: () => { min: number; max: number };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>({
    operation: 'addition',
    difficulty: 'easy',
  });

  const setOperation = (operation: OperationType) => {
    setSettings((prev) => ({ ...prev, operation }));
  };

  const setDifficulty = (difficulty: Difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty }));
  };

  const getNumberRange = () => {
    switch (settings.difficulty) {
      case 'easy':
        return { min: 1, max: 10 };
      case 'medium':
        return { min: 1, max: 20 };
      case 'hard':
        return { min: 1, max: 100 };
      default:
        return { min: 1, max: 10 };
    }
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        setOperation,
        setDifficulty,
        getNumberRange,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
