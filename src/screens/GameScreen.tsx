import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ResourceType } from '../types';
import { useGame } from '../context/GameContext';
import { ColorPicker, ResourceCounter, ImageButton } from '../components';
import { useAndroidNavBar, usePressAnimation } from '../hooks';
import { s } from '../utils/scale';
import * as Haptics from 'expo-haptics';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameScreen'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

export const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { playerCount } = route.params;
  const {
    gameState,
    setPlayerColor,
    updateResource,
    setPhase,
    calculateScores,
    initializeGame,
  } = useGame();

  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const resourceFadeAnim = useRef(new Animated.Value(1)).current;

  // Per-player touch flash animations.
  const touchEffectAnims = useRef(
    Array.from({ length: 4 }, () => ({
      increment: new Animated.Value(0),
      decrement: new Animated.Value(0),
    }))
  ).current;

  useAndroidNavBar();

  const backPress = usePressAnimation();
  const forwardPress = usePressAnimation();

  // Initialize game if state is empty (e.g. coming from a restart).
  useEffect(() => {
    if (gameState.players.length === 0 || gameState.playerCount !== playerCount) {
      initializeGame(playerCount);
    }
  }, [playerCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade the screen in on mount.
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the resource visible when navigating between them.
  useEffect(() => {
    resourceFadeAnim.setValue(1);
  }, [currentResourceIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalResources = gameState.players[0]?.resources.length ?? 9;
  const isFirstResource = currentResourceIndex === 0;
  const isLastResource = currentResourceIndex === totalResources - 1;

  const handleNextResource = () => {
    if (!isLastResource) {
      setCurrentResourceIndex((prev) => prev + 1);
    } else {
      calculateScores();
      navigation.navigate('ScoreScreen');
    }
  };

  const handlePreviousResource = () => {
    if (!isFirstResource) {
      setCurrentResourceIndex((prev) => prev - 1);
    }
  };

  const triggerTouchEffect = (playerIndex: number, isIncrement: boolean) => {
    const anim = isIncrement
      ? touchEffectAnims[playerIndex].increment
      : touchEffectAnims[playerIndex].decrement;

    anim.setValue(0.2);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  // --- Layout helpers ---

  const getPlayerAreaStyle = (index: number): ViewStyle => {
    const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

    if (playerCount === 2) {
      return {
        width: screenWidth,
        height: screenHeight / 2,
        borderBottomWidth: index === 0 ? 2 : 0,
        borderColor: '#FFF',
      };
    }
    return {
      width: screenWidth / 2,
      height: screenHeight / 2,
      borderRightWidth: index % 2 === 0 ? 2 : 0,
      borderBottomWidth: index < 2 ? 2 : 0,
      borderColor: '#FFF',
    };
  };

  const getPlayerRotation = (index: number): string => {
    if (playerCount === 2) return index === 0 ? '180deg' : '0deg';
    return index % 2 === 0 ? '90deg' : '-90deg';
  };

  const getTouchAreaStyle = (playerIndex: number, isIncrement: boolean): ViewStyle => {
    if (playerCount === 2) {
      const base: ViewStyle = { position: 'absolute', top: 0, bottom: 0, width: '50%', zIndex: 10 };
      const isLeft = (playerIndex === 0) === isIncrement; // player 0 increments on left
      return isLeft ? { ...base, left: 0 } : { ...base, right: 0 };
    }

    const base: ViewStyle = { position: 'absolute', left: 0, right: 0, height: '50%', zIndex: 10 };
    const isBottom = (playerIndex % 2 === 0) === isIncrement; // left players increment on bottom
    return isBottom ? { ...base, bottom: 0 } : { ...base, top: 0 };
  };

  const getIndicatorPositionStyle = (playerIndex: number, isIncrement: boolean) => {
    if (playerCount === 2) {
      if (playerIndex === 0) {
        return isIncrement ? styles.touchIndicatorPlusPlayer0 : styles.touchIndicatorMinusPlayer0;
      }
      return isIncrement ? styles.touchIndicatorPlusPlayer1 : styles.touchIndicatorMinusPlayer1;
    }
    if (playerIndex % 2 === 0) {
      return isIncrement ? styles.touchIndicatorPlusLeft : styles.touchIndicatorMinusLeft;
    }
    return isIncrement ? styles.touchIndicatorPlusRight : styles.touchIndicatorMinusRight;
  };

  // --- Render helpers ---

  const getGradientColors = (color: string): [string, string, string] => {
    const base = color.length === 9 ? color.slice(0, 7) : color;
    return [base, `${base}DD`, `${base}BB`];
  };

  const renderColorSelection = () => (
    <View style={[styles.container, playerCount >= 3 ? styles.rowWrap : styles.column]}>
      {gameState.players.map((player, index) => (
        <View
          key={player.id}
          style={[styles.playerArea, getPlayerAreaStyle(index), { backgroundColor: player.color }]}
        >
          <View style={{ transform: [{ rotate: getPlayerRotation(index) }] }}>
            <ColorPicker
              currentColor={player.color}
              onColorSelect={(color) => setPlayerColor(player.id, color)}
              playerId={player.id}
            />
          </View>
        </View>
      ))}

      <View style={styles.centerButtonContainer}>
        <View style={{ transform: [{ rotate: playerCount >= 3 ? '90deg' : '0deg' }] }}>
          <ImageButton
            imageSource={require('../../assets/images/bonus_icon.png')}
            onPress={() => setPhase('resource-counting')}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </View>
  );

  const renderResourceCounting = () => (
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
        const rotation = getPlayerRotation(index);

        return (
          <View key={player.id} style={[styles.playerArea, getPlayerAreaStyle(index)]}>
            <LinearGradient
              colors={getGradientColors(player.color)}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Decrement touch area */}
            <TouchableWithoutFeedback
              onPress={() => {
                if (currentResource) {
                  updateResource(player.id, currentResource.type as ResourceType, -1);
                  triggerTouchEffect(index, false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={getTouchAreaStyle(index, false)}>
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: '#000000',
                      opacity: touchEffectAnims[index].decrement,
                      pointerEvents: 'none',
                      borderRadius: s(20),
                      margin: s(10),
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.touchIndicator,
                    getIndicatorPositionStyle(index, false),
                    { transform: [{ rotate: rotation }] },
                  ]}
                >
                  -
                </Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Increment touch area */}
            <TouchableWithoutFeedback
              onPress={() => {
                if (currentResource) {
                  updateResource(player.id, currentResource.type as ResourceType, 1);
                  triggerTouchEffect(index, true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={getTouchAreaStyle(index, true)}>
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: '#000000',
                      opacity: touchEffectAnims[index].increment,
                      pointerEvents: 'none',
                      borderRadius: s(20),
                      margin: s(10),
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.touchIndicator,
                    getIndicatorPositionStyle(index, true),
                    { transform: [{ rotate: rotation }] },
                  ]}
                >
                  +
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <Animated.View
              style={[
                styles.resourceList,
                { opacity: resourceFadeAnim, transform: [{ rotate: rotation }] },
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

      {/* 4th quadrant for 3-player mode: show all resource icons as a legend. */}
      {playerCount === 3 && (
        <View style={[styles.playerArea, getPlayerAreaStyle(3), styles.legendArea]}>
          <ScrollView contentContainerStyle={styles.resourceIconsList}>
            {gameState.players[0]?.resources.map((resource) => (
              <View key={resource.type} style={styles.resourceIconItem}>
                <Image source={resource.icon} style={styles.resourceIconImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Navigation buttons in centre */}
      <View style={styles.centerButtonContainer}>
        <View
          style={[
            styles.navigationButtons,
            { transform: [{ rotate: playerCount >= 3 ? '90deg' : '0deg' }] },
          ]}
        >
          {!isFirstResource && (
            <Animated.View style={backPress.animatedStyle}>
              <TouchableOpacity
                onPress={handlePreviousResource}
                onPressIn={backPress.onPressIn}
                onPressOut={backPress.onPressOut}
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

          <Animated.View style={forwardPress.animatedStyle}>
            <TouchableOpacity
              onPress={handleNextResource}
              onPressIn={forwardPress.onPressIn}
              onPressOut={forwardPress.onPressOut}
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

  return (
    <>
      <StatusBar hidden translucent backgroundColor="transparent" />
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
  legendArea: {
    backgroundColor: '#b0c550',
  },
  resourceList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(10),
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
    paddingVertical: s(20),
  },
  confirmButton: {
    minWidth: s(100),
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(40),
    paddingHorizontal: s(20),
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonImage: {
    width: s(80),
    height: s(80),
  },
  resourceIconsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(8),
  },
  resourceIconItem: {
    margin: s(4),
    padding: s(4),
  },
  resourceIconImage: {
    width: s(38),
    height: s(38),
    shadowOpacity: 0,
    elevation: 0,
  },
  touchIndicator: {
    position: 'absolute',
    fontSize: s(80),
    fontWeight: 'bold',
    color: '#000000',
    opacity: 0.25,
    textAlign: 'center',
    pointerEvents: 'none',
  },

  // ── 2-player indicator positions ──────────────────────────────────────────
  touchIndicatorMinusPlayer0: { bottom: '65%', left: '50%', marginLeft: s(-20) },
  touchIndicatorPlusPlayer0:  { bottom: '65%', left: '50%', marginLeft: s(-20) },
  touchIndicatorMinusPlayer1: { top: '65%',    left: '50%', marginLeft: s(-20) },
  touchIndicatorPlusPlayer1:  { top: '65%',    left: '50%', marginLeft: s(-20) },

  // ── 3-4 player indicator positions ────────────────────────────────────────
  touchIndicatorMinusLeft:  { top: '15%',    left: '50%', marginLeft: s(-20) },
  touchIndicatorPlusLeft:   { bottom: '15%', left: '50%', marginLeft: s(-20) },
  touchIndicatorMinusRight: { bottom: '15%', left: '50%', marginLeft: s(-20) },
  touchIndicatorPlusRight:  { top: '15%',    left: '50%', marginLeft: s(-20) },
});
