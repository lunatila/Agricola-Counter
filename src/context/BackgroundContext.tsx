import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { Animated } from 'react-native';
import { ANIMATION } from '../constants/animations';

interface BackgroundContextType {
  backgroundAnim: Animated.Value;
  animateBackground: (toValue: number, duration?: number) => Promise<void>;
  setBackgroundPosition: (value: number) => void;
  getBackgroundPosition: () => number;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Starts at 0 (main menu position).
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  // Tracks the current translateY value without accessing the private `_value` field.
  const currentPosition = useRef(0);

  const animateBackground = (toValue: number, duration: number = ANIMATION.BACKGROUND_SLIDE_MS): Promise<void> =>
    new Promise((resolve) => {
      Animated.timing(backgroundAnim, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(() => {
        currentPosition.current = toValue;
        resolve();
      });
    });

  const setBackgroundPosition = (value: number) => {
    backgroundAnim.setValue(value);
    currentPosition.current = value;
  };

  const getBackgroundPosition = (): number => currentPosition.current;

  return (
    <BackgroundContext.Provider
      value={{ backgroundAnim, animateBackground, setBackgroundPosition, getBackgroundPosition }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
