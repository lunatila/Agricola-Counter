import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { Animated } from 'react-native';

interface BackgroundContextType {
    backgroundAnim: Animated.Value;
    animateBackground: (toValue: number, duration?: number) => Promise<void>;
    setBackgroundPosition: (value: number) => void;
    getBackgroundPosition: () => number;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
    undefined
);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // Inicia em 0 (posição do menu principal)
    const backgroundAnim = useRef(new Animated.Value(0)).current;

    const animateBackground = (toValue: number, duration: number = 600): Promise<void> => {
        return new Promise((resolve) => {
            Animated.timing(backgroundAnim, {
                toValue,
                duration,
                useNativeDriver: true,
            }).start(() => resolve());
        });
    };

    const setBackgroundPosition = (value: number) => {
        backgroundAnim.setValue(value);
    };

    const getBackgroundPosition = (): number => {
        // @ts-ignore - accessing _value is needed to check current position
        return backgroundAnim._value;
    };

    return (
        <BackgroundContext.Provider
            value={{
                backgroundAnim,
                animateBackground,
                setBackgroundPosition,
                getBackgroundPosition,
            }}
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
