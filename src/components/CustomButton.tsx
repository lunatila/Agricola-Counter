import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePressAnimation } from '../hooks';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
}

const GRADIENT_COLORS: Record<'primary' | 'secondary', [string, string, string]> = {
  primary: ['#5A9D6A', '#4A7C59', '#3A5C49'],
  secondary: ['#9B5513', '#8B4513', '#7B3513'],
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const { onPressIn, onPressOut, animatedStyle } = usePressAnimation(0.95);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={GRADIENT_COLORS[variant]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.buttonShadow} />
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: s(12),
    minWidth: s(200),
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: s(15),
    paddingHorizontal: s(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s(12),
  },
  buttonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
