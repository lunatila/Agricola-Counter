import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Animated,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import { usePressAnimation } from '../hooks';
import { StyledText } from './StyledText';
import { s } from '../utils/scale';

interface ImageButtonProps {
  imageSource: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  /** Optional text displayed over the image using the Shadow+Outline font effect. */
  text?: string;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const ImageButton: React.FC<ImageButtonProps> = ({
  imageSource,
  onPress,
  style,
  imageStyle,
  text,
  textStyle,
  children,
}) => {
  const { onPressIn, onPressOut, animatedStyle } = usePressAnimation();

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.container}
      >
        <Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="contain" />

        {children ? (
          <View style={styles.textContainer}>{children}</View>
        ) : text ? (
          <View style={styles.textContainer}>
            <StyledText style={[styles.textBase, textStyle]}>{text}</StyledText>
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontSize: s(32),
  },
});
