import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Platform, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList, Player } from '../types';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { ImageButton, AdBanner } from '../components';
import { BACKGROUND_WIDTH, BACKGROUND_HEIGHT, BACKGROUND_OFFSET } from '../constants/background';

type ScoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ScoreScreen'
>;

interface ScoreScreenProps {
  navigation: ScoreScreenNavigationProp;
}

interface RevealedPlayer extends Player {
  revealed: boolean;
  position: number; // 1 = 1st place, 2 = 2nd, etc.
}

const { width } = Dimensions.get('window');

// Mapa de imagens dos painéis (renomeadas para melhor entendimento)
const PLACE_PANELS = {
  1: require('../../assets/images/1place.png'),
  2: require('../../assets/images/2place.png'),
  3: require('../../assets/images/3place.png'),
  4: require('../../assets/images/4place.png'),
};

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ navigation }) => {
  const { gameState, resetGame } = useGame();
  const { backgroundAnim, setBackgroundPosition } = useBackground();
  const [sortedPlayers, setSortedPlayers] = useState<RevealedPlayer[]>([]);
  const [animatedValues] = useState(
    gameState.players.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }

    // Ao entrar: background posicionado no offset (fundo alinhado com fundo da tela)
    setBackgroundPosition(-200);
  }, [setBackgroundPosition]);

  useFocusEffect(
    React.useCallback(() => {
      // Background já está em -1000 (posição fixa)
      // Iniciar revelação dos jogadores

      // Sort players by score (LOWEST to HIGHEST for reveal order)
      // Last place (4th) reveals first, then 3rd, 2nd, and finally 1st
      const sorted = [...gameState.players]
        .sort((a, b) => a.score - b.score) // Lowest score first
        .map((player, index) => ({
          ...player,
          revealed: false,
          position: gameState.players.length - index // 4th, 3rd, 2nd, 1st
        }));

      setSortedPlayers(sorted);

      // Reveal players one by one with delay (last place to first place)
      sorted.forEach((_, index) => {
        // Delay maior para mais suspense
        setTimeout(() => {
          setSortedPlayers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], revealed: true };
            return updated;
          });

          // Animação moderna de Zoom/Pop
          Animated.spring(animatedValues[index], {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }).start();
        }, (index + 1) * 2000); // 2 segundos de delay para mais suspense
      });
    }, [animatedValues, gameState.players])
  );

  const handleMainMenu = () => {
    // Navegar primeiro para evitar glitches visuais se o estado limpar enquanto ainda estamos na tela
    navigation.navigate('MainMenu');

    // Resetar o jogo após a transição ter começado/terminado
    setTimeout(() => {
      resetGame();
    }, 500);
  };

  const getPositionText = (position: number) => {
    if (position === 1) return '1st Place';
    if (position === 2) return '2nd Place';
    if (position === 3) return '3rd Place';
    if (position === 4) return '4th Place';
    return `${position}th Place`;
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Background image único */}
        {/* Background image único (Static for ScoreScreen) */}
        <Image
          source={require('../../assets/images/backgroundMain.png')}
          style={styles.staticBackground}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Banner de anúncio no topo - Stub para Expo Go */}
          <View style={styles.adContainer}>
            <AdBanner position="top" />
          </View>

          <View style={styles.content}>
            {/* Results Container */}
            <View style={styles.resultsContainer}>
              {sortedPlayers.slice().reverse().map((player, index) => {
                // Use o índice original para a animação
                const originalIndex = sortedPlayers.length - 1 - index;
                const animatedStyle = {
                  opacity: animatedValues[originalIndex],
                  transform: [
                    {
                      scale: animatedValues[originalIndex].interpolate({
                        inputRange: [0, 0.8, 1],
                        outputRange: [0.5, 1.1, 1], // Zoom com efeito elástico (pop)
                      }),
                    },
                  ],
                };

                return (
                  <Animated.View
                    key={player.id}
                    style={[styles.resultCard, animatedStyle]}
                  >
                    <View style={styles.panelContainer}>
                      {/* Camada 1 (fundo): Máscara colorida com a cor do jogador */}
                      <Image
                        source={require('../../assets/images/mask.png')}
                        style={styles.panelImage}
                        resizeMode="cover"
                        tintColor={player.color}
                      />

                      {/* Camada 2 (frente): Arte original sobreposta (sem colorização) */}
                      <Image
                        source={PLACE_PANELS[player.position as keyof typeof PLACE_PANELS]}
                        style={styles.panelImageOverlay}
                        resizeMode="cover"
                      />

                      {/* Text Overlay Container */}
                      <View style={styles.textOverlay}>
                        {/* ========== POSIÇÃO (TOPO) ========== */}
                        <View style={styles.positionTextContainer}>
                          {/* Sombra do texto de posição */}
                          <Text style={styles.positionTextShadow}>
                            {getPositionText(player.position)}
                          </Text>
                          {/* Outline do texto de posição */}
                          <Text style={styles.positionTextOutline}>
                            {getPositionText(player.position)}
                          </Text>
                        </View>

                        {/* ========== PONTUAÇÃO (EMBAIXO) ========== */}
                        <View style={styles.scoreTextContainer}>
                          {/* Sombra do texto de pontos */}
                          <Text style={styles.scoreTextShadow}>
                            {player.score}
                          </Text>
                          {/* Outline do texto de pontos */}
                          <Text style={styles.scoreTextOutline}>
                            {player.score}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
            </View>

            {/* Show home button after all players are revealed */}
            {sortedPlayers.every((p) => p.revealed) && (
              <View style={styles.homeButtonContainer}>
                <ImageButton
                  imageSource={require('../../assets/images/home_button.png')}
                  onPress={handleMainMenu}
                  style={styles.cornerButton}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b0c550', // Fallback color
  },
  staticBackground: {
    position: 'absolute',
    width: width,
    height: '100%', // Cover full height
    top: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 20,
  },
  resultCard: {
    alignItems: 'center',
  },
  panelContainer: {
    position: 'relative',
    width: width * 0.60, // 85% da largura da tela
    height: width * 0.25, // Altura proporcional
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  panelImageOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width * 0.03, // ← AJUSTE: Espaçamento vertical (padding)
  },

  // ========================================
  // POSIÇÃO (Texto no TOPO) - AJUSTÁVEL
  // ========================================
  positionTextContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0,
  },
  positionTextShadow: {
    position: 'absolute',
    fontSize: width * 0.04, // ← AJUSTE: Tamanho do texto de posição (5% da largura)
    fontFamily: 'Shadow',
    color: '#f9c32b',
    textAlign: 'center',
  },
  positionTextOutline: {
    position: 'absolute',
    fontSize: width * 0.04, // ← AJUSTE: Tamanho do texto de posição (5% da largura)
    fontFamily: 'Outline',
    color: '#000000',
    textAlign: 'center',
  },

  // ========================================
  // PONTUAÇÃO (Texto EMBAIXO) - AJUSTÁVEL
  // ========================================
  scoreTextContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0.08,
  },
  scoreTextShadow: {
    position: 'absolute',
    fontSize: width * 0.12, // ← AJUSTE: Tamanho do texto de pontos (12% da largura - MAIOR)
    fontFamily: 'Shadow',
    color: '#f9c32b',
    textAlign: 'center',
  },
  scoreTextOutline: {
    position: 'absolute',
    fontSize: width * 0.12, // ← AJUSTE: Tamanho do texto de pontos (12% da largura - MAIOR)
    fontFamily: 'Outline',
    color: '#000000',
    textAlign: 'center',
  },

  hiddenCard: {
    width: width * 0.85,
    height: width * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
  },
  hiddenText: {
    fontSize: 32,
    color: '#CCC',
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cornerButton: {
    width: 60,
    height: 60,
  },
});
