import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Animated,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';

interface ImageButtonProps {
  imageSource: ImageSourcePropType;
  onPress: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.container}
      >
        <Image
          source={imageSource}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
        {children ? (
          <View style={styles.textContainer}>
            {children}
          </View>
        ) : text ? (
          <View style={styles.textContainer}>
            {/* Shadow text layer (bottom) */}
            <Text style={[styles.textShadow, textStyle]}>
              {text}
            </Text>
            {/* Outline text layer (top) */}
            <Text style={[styles.textOutline, textStyle]}>
              {text}
            </Text>
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
    width: '100%',    // Usa 100% do container pai
    height: '100%',   // Usa 100% do container pai
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textShadow: {
    position: 'absolute',
    fontSize: 32,
    fontFamily: 'Shadow',
    color: '#f9c32b',
  },
  textOutline: {
    position: 'absolute',
    fontSize: 32,
    fontFamily: 'Outline',
    color: '#000000',
  },
});
