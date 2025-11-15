import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { Resource } from '../types';

interface ResourceCounterProps {
  resource: Resource;
  onIncrement?: () => void;
  onDecrement?: () => void;
  layout?: 'vertical' | 'horizontal'; // vertical for 2 players, horizontal for 3-4 players
}

export const ResourceCounter: React.FC<ResourceCounterProps> = ({
  resource,
  layout = 'vertical',
}) => {
  const countAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate count change
    Animated.sequence([
      Animated.timing(countAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(countAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [resource.count]);

  return (
    <View style={styles.container}>

      {/* Center content - Icon and count */}
      <View style={[
        styles.centerContent,
        layout === 'horizontal' && styles.centerContentHorizontal
      ]}>
        <View style={[
          styles.iconContainer,
          layout === 'horizontal' && styles.iconContainerHorizontal
        ]}>
          <Image
            source={resource.icon}
            style={[
              styles.icon,
              layout === 'horizontal' && styles.iconHorizontal
            ]}
            resizeMode="contain"
          />
        </View>
        <View style={[
          styles.countContainer,
          layout === 'horizontal' && styles.countContainerHorizontal
        ]}>
          {/* Shadow text layer (bottom) */}
          <Animated.Text
            style={[
              styles.countShadow,
              layout === 'horizontal' && styles.countShadowHorizontal,
              { transform: [{ scale: countAnim }] }
            ]}
          >
            {resource.count}
          </Animated.Text>
          {/* Outline text layer (top) */}
          <Animated.Text
            style={[
              styles.countOutline,
              layout === 'horizontal' && styles.countOutlineHorizontal,
              { transform: [{ scale: countAnim }] }
            ]}
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
    gap: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 100,
  },
  iconContainerHorizontal: {
    marginBottom: 0,
  },
  icon: {
    width: 220,
    height: 220,
  },
  iconHorizontal: {
    width: 160,
    height: 160,
  },
  countContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    paddingHorizontal: 20,
  },
  countContainerHorizontal: {
    minWidth: 120,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  countShadow: {
    position: 'absolute',
    fontSize: 100,
    fontFamily: 'Shadow',
    color: '#f9c32b',
    textAlign: 'center',
  },
  countShadowHorizontal: {
    fontSize: 80,
  },
  countOutline: {
    position: 'absolute',
    fontSize: 100,
    fontFamily: 'Outline',
    color: '#000000',
    textAlign: 'center',
  },
  countOutlineHorizontal: {
    fontSize: 80,
  },
});
