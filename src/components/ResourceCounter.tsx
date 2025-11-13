import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Resource } from '../types';

interface ResourceCounterProps {
  resource: Resource;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const ResourceCounter: React.FC<ResourceCounterProps> = ({
  resource,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.decrementArea}
        onPress={onDecrement}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <View style={styles.centerArea}>
        <Image source={resource.icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.resourceName}>{resource.name}</Text>
        <Text style={styles.count}>{resource.count}</Text>
      </View>

      <TouchableOpacity
        style={styles.incrementArea}
        onPress={onIncrement}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  decrementArea: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  incrementArea: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  centerArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  resourceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    minWidth: 30,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
