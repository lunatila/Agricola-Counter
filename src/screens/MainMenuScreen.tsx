import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  BackHandler,
  Animated,
} from 'react-native';
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

type MainMenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainMenu'>;

interface MainMenuScreenProps {
  navigation: MainMenuScreenNavigationProp;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ navigation }) => {
  const { resetGame, gameState } = useGame();
  const { backgroundAnim, animateBackground } = useBackground();

  useAndroidNavBar();

  const { opacity: buttonsOpacity, scale: buttonsScale, show: showButtons, hide: hideButtons } =
    useContentAnimation();
  useFocusEffect(
    React.useCallback(() => {
      animateBackground(0, 1000).then(() => showButtons());

      if (gameState.players && gameState.players.length > 0) {
        resetGame();
      }
    }, [animateBackground, showButtons, resetGame, gameState.players])
  );

  const handleNavigation = (navigateFn: () => void, slideTarget: number) => {
    hideButtons(() => {
      animateBackground(slideTarget, 600).then(() => {
        setTimeout(navigateFn, 50);
      });
    });
  };

  const bg = getBackgroundSize();

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
          style={[styles.buttonContainer, { opacity: buttonsOpacity, transform: [{ scale: buttonsScale }] }]}
        >
          <ImageButton
            imageSource={require('../../assets/images/play_button.png')}
            text="Play"
            onPress={() => handleNavigation(() => navigation.navigate('PlayerCountSelection'), -200)}
            style={styles.button}
            imageStyle={styles.playButtonImage}
          />
          <ImageButton
            imageSource={require('../../assets/images/exit_button.png')}
            text="Exit"
            onPress={() => BackHandler.exitApp()}
            style={styles.button}
            imageStyle={styles.exitButtonImage}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.aboutButtonContainer,
            { opacity: buttonsOpacity, transform: [{ scale: buttonsScale }] },
          ]}
        >
          <ImageButton
            imageSource={require('../../assets/images/about_button.png')}
            onPress={() => handleNavigation(() => navigation.navigate('About'), -200)}
            style={styles.cornerButton}
            imageStyle={styles.cornerButtonImage}
          />
        </Animated.View>

        {/* Sound button temporarily hidden */}
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
    gap: s(20),
  },
  button: {
    width: s(250),
    height: s(80),
  },
  playButtonImage: {
    width: s(250),
    height: s(70),
  },
  exitButtonImage: {
    width: s(250),
    height: s(60),
  },
  aboutButtonContainer: {
    position: 'absolute',
    bottom: s(20),
    left: s(20),
  },
  soundButtonContainer: {
    position: 'absolute',
    bottom: s(20),
    right: s(20),
  },
  cornerButton: {
    width: s(60),
    height: s(60),
  },
  cornerButtonImage: {
    width: s(60),
    height: s(60),
  },
});
