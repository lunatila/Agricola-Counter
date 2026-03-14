import React from 'react';
import { View } from 'react-native';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

/**
 * Stub component — ads are disabled for Expo Go builds.
 * To re-enable, see REATIVAR_ANUNCIOS.md.
 */
export const AdBanner: React.FC<AdBannerProps> = () => (
  <View style={{ height: 50, backgroundColor: 'transparent' }} />
);
