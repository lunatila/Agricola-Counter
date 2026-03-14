import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { Resource } from '../types';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

interface ResourceCounterProps {
  resource: Resource;
  layout?: 'vertical' | 'horizontal';
}

export const ResourceCounter: React.FC<ResourceCounterProps> = ({
  resource,
  layout = 'vertical',
}) => {
  const countAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(countAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(countAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [resource.count]); // eslint-disable-line react-hooks/exhaustive-deps

  const isHorizontal = layout === 'horizontal';
  const countAnimStyle = { transform: [{ scale: countAnim }] };

  const fontSize = isHorizontal ? s(104) : s(112);

  return (
    <View style={styles.container}>
      <View style={[styles.centerContent, isHorizontal && styles.centerContentHorizontal]}>
        <View style={[styles.iconContainer, isHorizontal && styles.iconContainerHorizontal]}>
          <Image
            source={resource.icon}
            style={[styles.icon, isHorizontal && styles.iconHorizontal]}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.countContainer, isHorizontal && styles.countContainerHorizontal]}>
          {/* Shadow text layer (bottom) */}
          <Animated.Text
            style={[styles.countShadow, { fontSize }, countAnimStyle]}
          >
            {resource.count}
          </Animated.Text>
          {/* Outline text layer (top) */}
          <Animated.Text
            style={[styles.countOutline, { fontSize }, countAnimStyle]}
          >
            {resource.count}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    pointerEvents: 'box-none',
    overflow: 'visible',
  },
  centerContentHorizontal: {
    flexDirection: 'row',
    gap: s(20),
  },
  iconContainer: {
    position: 'relative',
    marginBottom: s(100),
  },
  iconContainerHorizontal: {
    marginBottom: 0,
  },
  icon: {
    width: s(220),
    height: s(220),
  },
  iconHorizontal: {
    width: s(160),
    height: s(160),
  },
  countContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s(220),
    paddingHorizontal: s(30),
  },
  countContainerHorizontal: {
    minWidth: s(150),
    paddingHorizontal: s(20),
    marginBottom: 0,
  },
  countShadow: {
    position: 'absolute',
    fontFamily: 'Shadow',
    color: Colors.textShadow,
    textAlign: 'center',
  },
  countOutline: {
    position: 'absolute',
    fontFamily: 'Outline',
    color: Colors.black,
    textAlign: 'center',
  },
});
