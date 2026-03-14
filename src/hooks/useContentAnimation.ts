import { useRef } from 'react';
import { Animated } from 'react-native';
import { ANIMATION } from '../constants/animations';

interface ContentAnimationResult {
  opacity: Animated.Value;
  scale: Animated.Value;
  /** Reset values to 0 then animate opacity and scale in. */
  show: () => void;
  /** Animate opacity and scale out, then call `onComplete`. */
  hide: (onComplete?: () => void) => void;
}

/**
 * Manages the appear/disappear animation used by menu screens.
 * - `show()`: fades and scales content in from nothing.
 * - `hide(cb)`: fades and shrinks content out, then invokes `cb`.
 *
 * This replaces the identical `contentOpacity` + `contentScale` pattern
 * that was copy-pasted into ExpansionSelectScreen, PlayerCountSelectionScreen,
 * and AboutScreen.
 */
export function useContentAnimation(): ContentAnimationResult {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  const show = () => {
    opacity.setValue(0);
    scale.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION.CONTENT_SHOW_MS,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        ...ANIMATION.CONTENT_APPEAR,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hide = (onComplete?: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION.CONTENT_HIDE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: ANIMATION.CONTENT_HIDE_MS,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete?.());
  };

  return { opacity, scale, show, hide };
}
