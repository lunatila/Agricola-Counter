import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Player } from '../types';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { ImageButton, AdBanner, StyledText } from '../components';
import { useAndroidNavBar } from '../hooks';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';
import { ANIMATION } from '../constants/animations';

type ScoreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScoreScreen'>;

interface ScoreScreenProps {
  navigation: ScoreScreenNavigationProp;
}

interface RevealedPlayer extends Player {
  revealed: boolean;
  position: number;
}

const PLACE_PANELS: Record<number, ReturnType<typeof require>> = {
  1: require('../../assets/images/1place.png'),
  2: require('../../assets/images/2place.png'),
  3: require('../../assets/images/3place.png'),
  4: require('../../assets/images/4place.png'),
};

const POSITION_LABELS: Record<number, string> = {
  1: '1st Place',
  2: '2nd Place',
  3: '3rd Place',
  4: '4th Place',
};

const getPositionText = (position: number): string =>
  POSITION_LABELS[position] ?? `${position}th Place`;

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ navigation }) => {
  const { gameState, resetGame } = useGame();
  const { setBackgroundPosition } = useBackground();
  const [sortedPlayers, setSortedPlayers] = useState<RevealedPlayer[]>([]);
  const [animatedValues] = useState(() =>
    gameState.players.map(() => new Animated.Value(0))
  );

  useAndroidNavBar();

  useEffect(() => {
    setBackgroundPosition(-200);
  }, [setBackgroundPosition]);

  useFocusEffect(
    React.useCallback(() => {
      // Sort lowest → highest score; last place reveals first for suspense.
      const sorted = [...gameState.players]
        .sort((a, b) => a.score - b.score)
        .map((player, index) => ({
          ...player,
          revealed: false,
          position: gameState.players.length - index,
        }));

      setSortedPlayers(sorted);

      sorted.forEach((_, index) => {
        setTimeout(() => {
          setSortedPlayers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], revealed: true };
            return updated;
          });

          Animated.spring(animatedValues[index], {
            toValue: 1,
            ...ANIMATION.RESULT_POP,
            useNativeDriver: true,
          }).start();
        }, (index + 1) * 2000);
      });
    }, [animatedValues, gameState.players])
  );

  const handleMainMenu = () => {
    navigation.navigate('MainMenu');
    setTimeout(() => resetGame(), 500);
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/backgroundMain.png')}
          style={styles.background}
          resizeMode="cover"
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.adContainer}>
            <AdBanner position="top" />
          </View>

          <View style={styles.content}>
            <View style={styles.resultsContainer}>
              {/* Display from 1st place down to last place. */}
              {sortedPlayers
                .slice()
                .reverse()
                .map((player, displayIndex) => {
                  const originalIndex = sortedPlayers.length - 1 - displayIndex;
                  const animVal = animatedValues[originalIndex];
                  const animatedStyle = {
                    opacity: animVal,
                    transform: [
                      {
                        scale: animVal.interpolate({
                          inputRange: [0, 0.8, 1],
                          outputRange: [0.5, 1.1, 1],
                        }),
                      },
                    ],
                  };

                  return (
                    <Animated.View key={player.id} style={[styles.resultCard, animatedStyle]}>
                      <View style={styles.panelContainer}>
                        {/* Layer 1: coloured mask (player colour). */}
                        <Image
                          source={require('../../assets/images/mask.png')}
                          style={styles.panelImage}
                          resizeMode="cover"
                          tintColor={player.color}
                        />
                        {/* Layer 2: place-panel artwork. */}
                        <Image
                          source={PLACE_PANELS[player.position]}
                          style={styles.panelImage}
                          resizeMode="cover"
                        />

                        <View style={styles.textOverlay}>
                          <View style={styles.positionTextContainer}>
                            <StyledText style={styles.positionText}>
                              {getPositionText(player.position)}
                            </StyledText>
                          </View>
                          <View style={styles.scoreTextContainer}>
                            <StyledText style={styles.scoreText}>
                              {String(player.score)}
                            </StyledText>
                          </View>
                        </View>
                      </View>
                    </Animated.View>
                  );
                })}
            </View>

            {sortedPlayers.every((p) => p.revealed) && (
              <View style={styles.homeButtonContainer}>
                <ImageButton
                  imageSource={require('../../assets/images/home_button.png')}
                  onPress={handleMainMenu}
                  style={styles.homeButton}
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
    backgroundColor: Colors.appBackground,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: s(10),
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingVertical: s(20),
    justifyContent: 'center',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: s(15),
    paddingVertical: s(20),
  },
  resultCard: {
    alignItems: 'center',
  },
  panelContainer: {
    width: s(480),
    height: s(200),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textOverlay: {
    width: '100%',
    height: '100%',
    paddingVertical: s(24),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionTextContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontSize: s(32),
  },
  scoreTextContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(64),
  },
  scoreText: {
    fontSize: s(96),
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: s(20),
    right: s(20),
  },
  homeButton: {
    width: s(60),
    height: s(60),
  },
});
