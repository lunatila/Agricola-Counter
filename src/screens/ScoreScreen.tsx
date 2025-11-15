import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList, Player } from '../types';
import { useGame } from '../context/GameContext';
import { ImageButton } from '../components';

type ScoreScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ScoreScreen'
>;

interface ScoreScreenProps {
  navigation: ScoreScreenNavigationProp;
}

interface RevealedPlayer extends Player {
  revealed: boolean;
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ navigation }) => {
  const { gameState, resetGame } = useGame();
  const [sortedPlayers, setSortedPlayers] = useState<RevealedPlayer[]>([]);
  const [animatedValues] = useState(
    gameState.players.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }

    // Sort players by score (lowest to highest for reveal order)
    const sorted = [...gameState.players]
      .sort((a, b) => a.score - b.score)
      .map((player) => ({ ...player, revealed: false }));

    setSortedPlayers(sorted);

    // Reveal players one by one with delay, starting from last (lowest score)
    sorted.forEach((_, index) => {
      setTimeout(() => {
        setSortedPlayers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], revealed: true };
          return updated;
        });

        // Animate the reveal
        Animated.spring(animatedValues[index], {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }, (index + 1) * 1500); // 1.5 second delay between reveals
    });
  }, []);

  const handleMainMenu = () => {
    resetGame();
    navigation.navigate('MainMenu');
  };

  const getRankText = (index: number) => {
    const totalPlayers = sortedPlayers.length;
    const rank = totalPlayers - index;

    if (rank === 1) return '🏆 1º Lugar';
    if (rank === 2) return '🥈 2º Lugar';
    if (rank === 3) return '🥉 3º Lugar';
    return `${rank}º Lugar`;
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Pontuação Final</Text>

          <View style={styles.resultsContainer}>
          {[...sortedPlayers].reverse().map((player, reverseIndex) => {
            const index = sortedPlayers.length - 1 - reverseIndex;
            const animatedStyle = {
              opacity: animatedValues[index],
              transform: [
                {
                  scale: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            };

            return (
              <Animated.View
                key={player.id}
                style={[styles.resultCard, animatedStyle]}
              >
                {player.revealed ? (
                  <>
                    <View style={styles.rankContainer}>
                      <Text style={styles.rankText}>
                        {getRankText(index)}
                      </Text>
                    </View>

                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreLabel}>Pontuação:</Text>
                      <Text style={styles.scoreValue}>{player.score}</Text>
                    </View>

                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: player.color },
                      ]}
                    >
                      <Text style={styles.playerText}>
                        Jogador {player.id + 1}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.hiddenCard}>
                    <Text style={styles.hiddenText}>...</Text>
                  </View>
                )}
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
              imageStyle={styles.cornerButtonImage}
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
    backgroundColor: '#b0c550',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rankContainer: {
    marginBottom: 5,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#555',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C59',
  },
  colorIndicator: {
    marginTop: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  playerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hiddenCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  cornerButtonImage: {
    width: 60,
    height: 60,
  },
});
