import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TOOLBAR_HEIGHT = 56;

const DEVICES = {
  galaxy: { label: 'Galaxy S25 Ultra', width: 412, height: 915 },
  tab: { label: 'Samsung Tab S9', width: 800, height: 1280 },
} as const;

type DeviceKey = keyof typeof DEVICES;

function applyDimensions(device: (typeof DEVICES)[DeviceKey]) {
  const dim = { width: device.width, height: device.height, scale: 1, fontScale: 1 };
  Dimensions.set({ window: dim, screen: dim });
}

function getScale(device: (typeof DEVICES)[DeviceKey]): number {
  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight - TOOLBAR_HEIGHT;
  return Math.min(availableWidth / device.width, availableHeight / device.height);
}

interface WebDeviceFrameProps {
  children: React.ReactNode;
}

export const WebDeviceFrame: React.FC<WebDeviceFrameProps> = ({ children }) => {
  const [deviceKey, setDeviceKey] = useState<DeviceKey>(() => {
    applyDimensions(DEVICES.galaxy);
    return 'galaxy';
  });

  // Lazy initializer so the correct scale is used on the very first render.
  const [scale, setScale] = useState(() => getScale(DEVICES.galaxy));

  const refreshScale = useCallback((key: DeviceKey) => {
    setScale(getScale(DEVICES[key]));
  }, []);

  useEffect(() => {
    refreshScale(deviceKey);
    const onResize = () => refreshScale(deviceKey);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceKey, refreshScale]);

  const handleDeviceSelect = (key: DeviceKey) => {
    applyDimensions(DEVICES[key]);
    setDeviceKey(key);
    setScale(getScale(DEVICES[key]));
  };

  const device = DEVICES[deviceKey];

  // The device frame is centered in the canvas and scaled via transform.
  // Because scale = min(canvasW / deviceW, canvasH / deviceH), the visual
  // content fills exactly the available space with no overflow.
  // transform: [{ scale }] scales from the element's center, so the centered
  // layout + centered scale means the visual top-left aligns with the canvas edge.
  return (
    <View style={styles.root}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        {(Object.keys(DEVICES) as DeviceKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleDeviceSelect(key)}
            style={[styles.deviceButton, deviceKey === key && styles.deviceButtonActive]}
          >
            <Text style={[styles.deviceButtonText, deviceKey === key && styles.deviceButtonTextActive]}>
              {DEVICES[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Black canvas — device frame is centered and scaled */}
      <View style={styles.canvas}>
        <View
          style={{
            width: device.width,
            height: device.height,
            overflow: 'hidden',
            transform: [{ scale }],
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  toolbar: {
    height: TOOLBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
  },
  deviceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
  },
  deviceButtonActive: {
    backgroundColor: '#4A7C59',
    borderColor: '#4A7C59',
  },
  deviceButtonText: {
    color: '#aaa',
    fontSize: 14,
  },
  deviceButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});
