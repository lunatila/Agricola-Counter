import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ResourceType } from '../types';
import { useGame } from '../context/GameContext';
import { ColorPicker, ResourceCounter, CustomButton } from '../components';

type GameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GameScreen'
>;

type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

export const GameScreen: React.FC<GameScreenProps> = ({
  navigation,
  route,
}) => {
  const { playerCount } = route.params;
  const { gameState, setPlayerColor, updateResource, setPlayerReady, setPhase, calculateScores } =
    useGame();
  const [allColorsSelected, setAllColorsSelected] = useState(false);

  // Check if all players have selected colors
  useEffect(() => {
    const defaultColor = '#CCCCCC';
    const allSelected = gameState.players.every(
      (player) => player.color !== defaultColor
    );
    setAllColorsSelected(allSelected);
  }, [gameState.players]);

  const handleColorSelect = (playerId: number, color: string) => {
    setPlayerColor(playerId, color);
  };

  const handleConfirmColors = () => {
    setPhase('resource-counting');
  };

  const handleGoToScore = () => {
    calculateScores();
    navigation.navigate('ScoreScreen');
  };

  // Calculate player area dimensions based on player count
  const getPlayerAreaStyle = (index: number) => {
    if (playerCount === 2) {
      // 2 players: vertical split
      return {
        width: width / 2,
        height: height,
        borderRightWidth: index === 0 ? 2 : 0,
        borderColor: '#FFF',
      };
    } else if (playerCount === 3) {
      // 3 players: horizontal split
      return {
        width: width,
        height: height / 3,
        borderBottomWidth: index < 2 ? 2 : 0,
        borderColor: '#FFF',
      };
    } else {
      // 4 players: quadrants
      return {
        width: width / 2,
        height: height / 2,
        borderRightWidth: index % 2 === 0 ? 2 : 0,
        borderBottomWidth: index < 2 ? 2 : 0,
        borderColor: '#FFF',
      };
    }
  };

  const renderColorSelection = () => {
    return (
      <View
        style={[
          styles.container,
          playerCount === 2 ? styles.row : styles.column,
        ]}
      >
        {gameState.players.map((player, index) => (
          <View
            key={player.id}
            style={[
              styles.playerArea,
              getPlayerAreaStyle(index),
              { backgroundColor: player.color },
            ]}
          >
            <ColorPicker
              currentColor={player.color}
              onColorSelect={(color) => handleColorSelect(player.id, color)}
              playerId={player.id}
            />
          </View>
        ))}

        {/* Confirm button in center when all colors are selected */}
        {allColorsSelected && (
          <View style={styles.centerButtonContainer}>
            <CustomButton
              title="Confirmar Cores"
              onPress={handleConfirmColors}
              style={styles.confirmButton}
            />
          </View>
        )}
      </View>
    );
  };

  const renderResourceCounting = () => {
    return (
      <View
        style={[
          styles.container,
          playerCount === 2 ? styles.row : styles.column,
        ]}
      >
        {gameState.players.map((player, index) => (
          <View
            key={player.id}
            style={[
              styles.playerArea,
              getPlayerAreaStyle(index),
              { backgroundColor: player.color },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.resourceList}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.playerTitle}>Jogador {player.id + 1}</Text>
              {player.resources.map((resource) => (
                <ResourceCounter
                  key={resource.type}
                  resource={resource}
                  onIncrement={() =>
                    updateResource(player.id, resource.type as ResourceType, 1)
                  }
                  onDecrement={() =>
                    updateResource(player.id, resource.type as ResourceType, -1)
                  }
                />
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Score button in center */}
        <View style={styles.centerButtonContainer}>
          <TouchableOpacity onPress={handleGoToScore}>
            <Image
              source={require('../../assets/images/score_button.png')}
              style={styles.scoreButton}
              resizeMode="contain"
            />
            <Text style={styles.scoreButtonText}>Calcular Pontuação</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {gameState.currentPhase === 'color-selection'
        ? renderColorSelection()
        : renderResourceCounting()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  playerArea: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  resourceList: {
    padding: 5,
  },
  centerButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    zIndex: 1000,
    elevation: 10,
  },
  confirmButton: {
    width: 150,
  },
  scoreButton: {
    width: 80,
    height: 80,
  },
  scoreButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
