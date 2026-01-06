import React from 'react';
import { View, Text } from 'react-native';

// COMPONENTE DESATIVADO PARA EXPO GO
// Para reativar, veja REATIVAR_ANUNCIOS.md

/*
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
*/

interface AdBannerProps {
    position?: 'top' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom' }) => {
    // Componente vazio para não quebrar o código
    // Os anúncios só funcionam em builds nativos (APK/AAB)
    return (
        <View style={{ height: 50, backgroundColor: 'transparent' }}>
            {/* Banner desativado para Expo Go */}
        </View>
    );
};

/*
// CÓDIGO ORIGINAL - DESCOMENTAR QUANDO FOR BUILDAR
export const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom' }) => {
  const adUnitId = Platform.select({
    ios: 'ca-app-pub-8005355086815746/2706011813',
    android: 'ca-app-pub-8005355086815746/2706011813',
  }) || TestIds.BANNER;

  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
      onAdFailedToLoad={(error) => {
        console.log('Erro ao carregar anúncio:', error);
      }}
    />
  );
};
*/
