import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, Player } from '../types';
import { useGame } from '../context/GameContext';
import { CustomButton } from '../components';

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
    // Sort players by score (lowest to highest for reveal order)
    const sorted = [...gameState.players]
      .sort((a, b) => a.score - b.score)
      .map((player) => ({ ...player, revealed: false }));

    setSortedPlayers(sorted);

    // Reveal players one by one with delay
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

  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('PlayerCountSelection');
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
    <LinearGradient
      colors={['#2C3E50', '#34495E', '#4A5F7F']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Pontuação Final</Text>

        <View style={styles.resultsContainer}>
          {sortedPlayers.map((player, index) => {
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

        {/* Show Play Again button after all players are revealed */}
        {sortedPlayers.every((p) => p.revealed) && (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Jogar Novamente"
              onPress={handlePlayAgain}
              style={styles.playAgainButton}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rankContainer: {
    marginBottom: 10,
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#555',
    marginRight: 10,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A7C59',
  },
  colorIndicator: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  playerText: {
    fontSize: 18,
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  playAgainButton: {
    minWidth: 250,
  },
});
