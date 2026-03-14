import { useRef } from 'react';
import { Animated } from 'react-native';
import { ANIMATION, PRESS_IN_SCALE } from '../constants/animations';

interface PressAnimationResult {
  onPressIn: () => void;
  onPressOut: () => void;
  /** Apply to the wrapping `Animated.View` to get the scale effect. */
  animatedStyle: { transform: [{ scale: Animated.Value }] };
}

/**
 * Returns press-in / press-out handlers and an animated style for a
 * spring scale effect. Pass the result to an `Animated.View` wrapper.
 *
 * @param pressedScale - Scale applied on press-in (default 0.85).
 */
export function usePressAnimation(pressedScale: number = PRESS_IN_SCALE): PressAnimationResult {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: pressedScale,
      ...ANIMATION.PRESS_IN,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      ...ANIMATION.PRESS_OUT,
      useNativeDriver: true,
    }).start();
  };

  return {
    onPressIn,
    onPressOut,
    animatedStyle: { transform: [{ scale }] },
  };
}
