import { Dimensions } from 'react-native';

/**
 * Background image native resolution: 786 × 2190 px (aspect ratio ≈ 1:2.787).
 *
 * The image is always scaled to fill the full device width, and its height is
 * computed to maintain that ratio. Screens then translateY the image to reveal
 * different sections as the user navigates.
 *
 * This is a **function** (not module-level constants) so that it always reads the
 * current `Dimensions` value — important for web device simulation where
 * `Dimensions.set()` changes the effective screen size at runtime.
 */
export function getBackgroundSize() {
  const { width, height } = Dimensions.get('window');
  const imageHeight = width * (2190 / 786);
  return {
    width,
    height: imageHeight,
    /** translateY needed to align the image bottom with the screen bottom. */
    offset: imageHeight - height,
  };
}
