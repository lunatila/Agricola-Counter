import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ResourceType } from '../types';
import { useGame } from '../context/GameContext';
import { ColorPicker, ResourceCounter, ImageButton } from '../components';

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
  const { gameState, setPlayerColor, updateResource, setPlayerReady, setPhase, calculateScores, initializeGame } =
    useGame();
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const resourceFadeAnim = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const forwardButtonScale = useRef(new Animated.Value(1)).current;

  // Click effect animations for each player's touch areas
  const touchEffectAnims = useRef(
    Array.from({ length: 4 }, () => ({
      increment: new Animated.Value(0),
      decrement: new Animated.Value(0),
    }))
  ).current;

  // Initialize game if players are empty (coming from restart)
  useEffect(() => {
    if (gameState.players.length === 0 || gameState.playerCount !== playerCount) {
      initializeGame(playerCount);
    }
  }, [playerCount]);

  // Initial fade-in animation and hide navigation bar
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  // Animate resource transitions - REMOVED FADE EFFECT
  useEffect(() => {
    // Reset fade animation value to 1 (fully visible) immediately
    resourceFadeAnim.setValue(1);
  }, [currentResourceIndex]);

  const handleColorSelect = (playerId: number, color: string) => {
    setPlayerColor(playerId, color);
  };

  const handleConfirmColors = () => {
    setPhase('resource-counting');
  };

  const handleNextResource = () => {
    const totalResources = gameState.players[0]?.resources.length || 9;
    if (currentResourceIndex < totalResources - 1) {
      setCurrentResourceIndex(currentResourceIndex + 1);
    } else {
      // Last resource - go to score screen
      calculateScores();
      navigation.navigate('ScoreScreen');
    }
  };

  const handlePreviousResource = () => {
    if (currentResourceIndex > 0) {
      setCurrentResourceIndex(currentResourceIndex - 1);
    }
  };

  const isLastResource = () => {
    const totalResources = gameState.players[0]?.resources.length || 9;
    return currentResourceIndex === totalResources - 1;
  };

  const isFirstResource = () => {
    return currentResourceIndex === 0;
  };

  const handleBackButtonPressIn = () => {
    Animated.spring(backButtonScale, {
      toValue: 0.85,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleBackButtonPressOut = () => {
    Animated.spring(backButtonScale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleForwardButtonPressIn = () => {
    Animated.spring(forwardButtonScale, {
      toValue: 0.85,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleForwardButtonPressOut = () => {
    Animated.spring(forwardButtonScale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  // Trigger touch effect animation
  const triggerTouchEffect = (playerIndex: number, isIncrement: boolean) => {
    const anim = isIncrement
      ? touchEffectAnims[playerIndex].increment
      : touchEffectAnims[playerIndex].decrement;

    anim.setValue(0.2); // Transparência maior (era 1, agora 0.3)
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };


  // Calculate player area dimensions based on player count
  const getPlayerAreaStyle = (index: number) => {
    const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

    if (playerCount === 2) {
      // 2 players: vertical split
      return {
        width: screenWidth,
        height: screenHeight / 2,
        borderBottomWidth: index === 0 ? 2 : 0,
        borderColor: '#FFF',
      };
    } else if (playerCount === 3 || playerCount === 4) {
      // 3 or 4 players: quadrants (2x2)
      return {
        width: screenWidth / 2,
        height: screenHeight / 2,
        borderRightWidth: index % 2 === 0 ? 2 : 0,
        borderBottomWidth: index < 2 ? 2 : 0,
        borderColor: '#FFF',
      };
    }
    return {};
  };

  // Get rotation for player content based on player count and position
  const getPlayerRotation = (index: number) => {
    if (playerCount === 2) {
      // Player 0 (top): rotated 180 degrees
      // Player 1 (bottom): normal orientation (0 degrees)
      return index === 0 ? '180deg' : '0deg';
    } else if (playerCount === 3 || playerCount === 4) {
      // Top-left (index 0): 90deg (left side)
      // Top-right (index 1): -90deg (right side)
      // Bottom-left (index 2): 90deg (left side)
      // Bottom-right (index 3): -90deg (right side)
      return index % 2 === 0 ? '90deg' : '-90deg';
    }
    return '0deg';
  };

  // Get touch area orientation based on player count and player index
  const getTouchAreaStyle = (playerIndex: number, isIncrement: boolean): ViewStyle => {
    if (playerCount === 2) {
      // For 2 players: vertical division (top/bottom)
      // Player 0 (top, rotated 180°): increment on left (their right)
      // Player 1 (bottom, no rotation): increment on right (their right)
      const baseStyle: ViewStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50%',
        zIndex: 10,
      };

      if (playerIndex === 0) {
        // Player 0 (top): increment on left, decrement on right
        if (isIncrement) {
          return { ...baseStyle, left: 0 };
        } else {
          return { ...baseStyle, right: 0 };
        }
      } else {
        // Player 1 (bottom): increment on right, decrement on left
        if (isIncrement) {
          return { ...baseStyle, right: 0 };
        } else {
          return { ...baseStyle, left: 0 };
        }
      }
    } else {
      // For 3-4 players: horizontal division (left/right)
      // Left players (indices 0, 2, rotated 90°): increment on bottom (their right)
      // Right players (indices 1, 3, rotated -90°): increment on top (their right)
      const baseStyle: ViewStyle = {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '50%',
        zIndex: 10,
      };

      if (playerIndex % 2 === 0) {
        // Left players (0, 2): increment on bottom, decrement on top
        if (isIncrement) {
          return { ...baseStyle, bottom: 0 };
        } else {
          return { ...baseStyle, top: 0 };
        }
      } else {
        // Right players (1, 3): increment on top, decrement on bottom
        if (isIncrement) {
          return { ...baseStyle, top: 0 };
        } else {
          return { ...baseStyle, bottom: 0 };
        }
      }
    }
  };

  // Get indicator position style based on player index and type (increment/decrement)
  const getIndicatorPositionStyle = (playerIndex: number, isIncrement: boolean) => {
    if (playerCount === 2) {
      // 2 players: vertical layout
      if (playerIndex === 0) {
        // Player 0 (top, rotated 180°): positions are inverted
        // For this player, their "bottom" is visually at the top
        return isIncrement ? styles.touchIndicatorPlusPlayer0 : styles.touchIndicatorMinusPlayer0;
      } else {
        // Player 1 (bottom, normal): positions are normal
        return isIncrement ? styles.touchIndicatorPlusPlayer1 : styles.touchIndicatorMinusPlayer1;
      }
    } else {
      // 3-4 players: horizontal layout
      if (playerIndex % 2 === 0) {
        // Left players (0, 2, rotated 90°)
        return isIncrement ? styles.touchIndicatorPlusLeft : styles.touchIndicatorMinusLeft;
      } else {
        // Right players (1, 3, rotated -90°): positions are inverted
        return isIncrement ? styles.touchIndicatorPlusRight : styles.touchIndicatorMinusRight;
      }
    }
  };


  const renderColorSelection = () => {
    return (
      <View
        style={[
          styles.container,
          playerCount >= 3 ? styles.rowWrap : styles.column,
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
            <View style={{ transform: [{ rotate: getPlayerRotation(index) }] }}>
              <ColorPicker
                currentColor={player.color}
                onColorSelect={(color) => handleColorSelect(player.id, color)}
                playerId={player.id}
              />
            </View>
          </View>
        ))}

        {/* Confirm button in center */}
        <View style={styles.centerButtonContainer}>
          <View style={{ transform: [{ rotate: playerCount >= 3 ? '90deg' : '0deg' }] }}>
            <ImageButton
              imageSource={require('../../assets/images/bonus_icon.png')}
              onPress={handleConfirmColors}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderResourceCounting = () => {
    const getGradientColors = (color: string): [string, string, string] => {
      // Remove existing alpha channel if present (e.g., #4ecda9ff -> #4ecda9)
      const baseColor = color.length === 9 ? color.slice(0, 7) : color;
      return [baseColor, baseColor + 'DD', baseColor + 'BB'];
    };

    return (
      <Animated.View
        style={[
          styles.container,
          playerCount >= 3 ? styles.rowWrap : styles.column,
          { opacity: fadeAnim },
        ]}
        collapsable={false}
      >
        {gameState.players.map((player, index) => {
          const currentResource = player.resources[currentResourceIndex];

          return (
            <View
              key={player.id}
              style={[
                styles.playerArea,
                getPlayerAreaStyle(index),
              ]}
            >
              <LinearGradient
                colors={getGradientColors(player.color)}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Touch areas - Decrement and Increment */}
              <TouchableWithoutFeedback
                onPress={() => {
                  if (currentResource) {
                    updateResource(player.id, currentResource.type as ResourceType, -1);
                    triggerTouchEffect(index, false);
                  }
                }}
              >
                <View style={getTouchAreaStyle(index, false)}>
                  {/* Touch effect overlay */}
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: '#000000',
                        opacity: touchEffectAnims[index].decrement,
                        pointerEvents: 'none',
                        borderRadius: 20,
                        margin: 10,
                      },
                    ]}
                  />
                  {/* Decrement indicator */}
                  <Text style={[
                    styles.touchIndicatorMinus,
                    getIndicatorPositionStyle(index, false),
                    { transform: [{ rotate: getPlayerRotation(index) }] }
                  ]}>
                    -
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  if (currentResource) {
                    updateResource(player.id, currentResource.type as ResourceType, 1);
                    triggerTouchEffect(index, true);
                  }
                }}
              >
                <View style={getTouchAreaStyle(index, true)}>
                  {/* Touch effect overlay */}
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: '#000000',
                        opacity: touchEffectAnims[index].increment,
                        pointerEvents: 'none',
                        borderRadius: 20,
                        margin: 10,
                      },
                    ]}
                  />
                  {/* Increment indicator */}
                  <Text style={[
                    styles.touchIndicatorPlus,
                    getIndicatorPositionStyle(index, true),
                    { transform: [{ rotate: getPlayerRotation(index) }] }
                  ]}>
                    +
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <Animated.View
                style={[
                  styles.resourceList,
                  {
                    opacity: resourceFadeAnim,
                    transform: [{ rotate: getPlayerRotation(index) }]
                  }
                ]}
                pointerEvents="none"
              >
                {currentResource && (
                  <ResourceCounter
                    key={currentResource.type}
                    resource={currentResource}
                    layout={playerCount === 2 ? 'vertical' : 'horizontal'}
                  />
                )}
              </Animated.View>
            </View>
          );
        })}

        {/* 4th quadrant for 3 players - show resource icons */}
        {playerCount === 3 && (
          <View
            style={[
              styles.playerArea,
              getPlayerAreaStyle(3),
              { backgroundColor: '#b0c550' }, // Same as menu background
            ]}
          >
            <ScrollView contentContainerStyle={styles.resourceIconsList}>
              {gameState.players[0]?.resources.map((resource) => (
                <View key={resource.type} style={styles.resourceIconItem}>
                  <Image
                    source={resource.icon}
                    style={styles.resourceIconImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Navigation buttons in center */}
        <View style={styles.centerButtonContainer}>
          <View style={[
            styles.navigationButtons,
            { transform: [{ rotate: playerCount >= 3 ? '90deg' : '0deg' }] }
          ]}>
            {/* Back button - only show if not first resource */}
            {!isFirstResource() && (
              <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
                <TouchableOpacity
                  onPress={handlePreviousResource}
                  onPressIn={handleBackButtonPressIn}
                  onPressOut={handleBackButtonPressOut}
                  activeOpacity={1}
                  style={styles.navButton}
                >
                  <Image
                    source={require('../../assets/images/restart_button.png')}
                    style={styles.navButtonImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Forward button */}
            <Animated.View style={{ transform: [{ scale: forwardButtonScale }] }}>
              <TouchableOpacity
                onPress={handleNextResource}
                onPressIn={handleForwardButtonPressIn}
                onPressOut={handleForwardButtonPressOut}
                activeOpacity={1}
                style={styles.navButton}
              >
                <Image
                  source={require('../../assets/images/go_button.png')}
                  style={styles.navButtonImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar hidden={true} translucent={true} backgroundColor="transparent" />
      <View style={styles.container}>
        {gameState.currentPhase === 'color-selection'
          ? renderColorSelection()
          : renderResourceCounting()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
  },
  playerArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  centerButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
    pointerEvents: 'box-none',
    paddingVertical: 20, // Safety margin for navigation buttons
  },
  confirmButton: {
    minWidth: 100,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20, // Safety margin to prevent overlap with icons
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonImage: {
    width: 80,
    height: 80,
  },
  resourceIconsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  resourceIconItem: {
    margin: 4,
    padding: 4,
  },
  resourceIconImage: {
    width: 38,
    height: 38,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  touchIndicatorMinus: {
    position: 'absolute',
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000000',
    opacity: 0.25,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  touchIndicatorPlus: {
    position: 'absolute',
    fontSize: 80,
    fontWeight: 'bold',
    color: '#000000',
    opacity: 0.25,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  // === ESTILOS PARA 2 JOGADORES ===
  // Player 0 (topo, rotacionado 180°) - posições INVERTIDAS
  touchIndicatorMinusPlayer0: {
    bottom: '65%',     // Visual: aparece no topo da área do jogador (invertido)
    left: '50%',
    marginLeft: -20,
  },
  touchIndicatorPlusPlayer0: {
    bottom: '65%',        // Visual: aparece na base da área do jogador (invertido)
    left: '50%',
    marginLeft: -20,
  },
  // Player 1 (embaixo, orientação normal) - posições NORMAIS
  touchIndicatorMinusPlayer1: {
    top: '65%',        // - no topo
    left: '50%',
    marginLeft: -20,
  },
  touchIndicatorPlusPlayer1: {
    top: '65%',     // + embaixo
    left: '50%',
    marginLeft: -20,
  },

  // === ESTILOS PARA 3-4 JOGADORES ===
  // Left players (0, 2) rotacionados 90° - posições NORMAIS
  touchIndicatorMinusLeft: {
    top: '15%',
    left: '50%',
    marginLeft: -20,
  },
  touchIndicatorPlusLeft: {
    bottom: '15%',
    left: '50%',
    marginLeft: -20,
  },
  // Right players (1, 3) rotacionados -90°/270° - posições INVERTIDAS
  touchIndicatorMinusRight: {
    bottom: '15%',     // Invertido por causa da rotação -90°
    left: '50%',
    marginLeft: -20,
  },
  touchIndicatorPlusRight: {
    top: '15%',        // Invertido por causa da rotação -90°
    left: '50%',
    marginLeft: -20,
  },
});
