import React from 'react';
import { View, StyleSheet, StatusBar, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { useAndroidNavBar, useContentAnimation } from '../hooks';
import { getBackgroundSize } from '../constants/background';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

type PlayerCountSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerCountSelection'
>;

interface PlayerCountSelectionScreenProps {
  navigation: PlayerCountSelectionScreenNavigationProp;
}

export const PlayerCountSelectionScreen: React.FC<PlayerCountSelectionScreenProps> = ({
  navigation,
}) => {
  const { initializeGame } = useGame();
  const { backgroundAnim, animateBackground } = useBackground();

  useAndroidNavBar();

  const { opacity, scale, show, hide } = useContentAnimation();

  const bg = getBackgroundSize();

  useFocusEffect(
    React.useCallback(() => {
      show();
    }, [show])
  );

  const handlePlayerCountSelect = (count: number) => {
    hide(() => {
      initializeGame(count);
      navigation.navigate('GameScreen', { playerCount: count });
    });
  };

  const handleGoBack = () => {
    hide(() => {
      animateBackground(0, 600).then(() => {
        setTimeout(() => navigation.goBack(), 50);
      });
    });
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Animated.Image
          source={require('../../assets/images/background.png')}
          style={[
            styles.backgroundBase,
            { width: bg.width, height: bg.height },
            { transform: [{ translateY: backgroundAnim }] },
          ]}
          resizeMode="cover"
        />

        <Animated.View
          style={[styles.buttonContainer, { opacity, transform: [{ scale }] }]}
        >
          <ImageButton
            imageSource={require('../../assets/images/2players.png')}
            onPress={() => handlePlayerCountSelect(2)}
            style={styles.playerButton}
          />
          <ImageButton
            imageSource={require('../../assets/images/3players.png')}
            onPress={() => handlePlayerCountSelect(3)}
            style={styles.playerButton}
          />
          <ImageButton
            imageSource={require('../../assets/images/4players.png')}
            onPress={() => handlePlayerCountSelect(4)}
            style={styles.playerButton}
          />
        </Animated.View>

        <Animated.View
          style={[styles.restartButtonContainer, { opacity, transform: [{ scale }] }]}
        >
          <ImageButton
            imageSource={require('../../assets/images/restart_button.png')}
            onPress={handleGoBack}
            style={styles.restartButton}
          />
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    alignItems: 'center',
    gap: 0,
  },
  playerButton: {
    width: s(280),
    height: s(160),
    marginVertical: s(-10),
  },
  restartButtonContainer: {
    position: 'absolute',
    bottom: s(20),
    left: s(20),
  },
  restartButton: {
    width: s(60),
    height: s(60),
  },
});
