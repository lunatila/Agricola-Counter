import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface StyledTextProps {
  children: React.ReactNode;
  /** Extra text styles (e.g. `fontSize`, `textAlign`). Both layers receive them. */
  style?: TextStyle;
  shadowColor?: string;
  outlineColor?: string;
}

/**
 * Renders the app's signature layered-font text effect:
 * a yellow Shadow layer beneath a black Outline layer.
 *
 * Both texts are `position: 'absolute'`, so the parent View must provide
 * explicit dimensions — the same contract as the original inline pattern.
 *
 * Usage:
 * ```tsx
 * <View style={styles.labelContainer}>
 *   <StyledText style={{ fontSize: 24 }}>Hello</StyledText>
 * </View>
 * ```
 */
export const StyledText: React.FC<StyledTextProps> = ({
  children,
  style,
  shadowColor = Colors.textShadow,
  outlineColor = Colors.black,
}) => (
  <>
    <Text style={[styles.shadow, { color: shadowColor }, style]}>{children}</Text>
    <Text style={[styles.outline, { color: outlineColor }, style]}>{children}</Text>
  </>
);

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    fontFamily: 'Shadow',
    textAlign: 'center',
  },
  outline: {
    position: 'absolute',
    fontFamily: 'Outline',
    textAlign: 'center',
  },
});
