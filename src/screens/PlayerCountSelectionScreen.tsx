import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { BACKGROUND_WIDTH, BACKGROUND_HEIGHT } from '../constants/background';

type PlayerCountSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerCountSelection'
>;

interface PlayerCountSelectionScreenProps {
  navigation: PlayerCountSelectionScreenNavigationProp;
}

export const PlayerCountSelectionScreen: React.FC<
  PlayerCountSelectionScreenProps
> = ({ navigation }) => {
  const { initializeGame } = useGame();
  const { backgroundAnim, animateBackground } = useBackground();
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  // Animate when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Background já está em -200 (vindo do MainMenu)
      // Apenas animar os botões aparecendo
      buttonsOpacity.setValue(0);
      buttonsScale.setValue(0);

      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }, [buttonsOpacity, buttonsScale])
  );

  const handlePlayerCountSelect = (count: number) => {
    // Animate buttons disappearing before navigation
    Animated.parallel([
      Animated.timing(buttonsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      initializeGame(count);
      navigation.navigate('GameScreen', { playerCount: count });
    });
  };

  const handleGoBack = () => {
    // Animate disappearing and slide background DOWN to 0
    Animated.parallel([
      Animated.timing(buttonsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animar background voltando para -100 (ExpansionSelect)
      animateBackground(-100, 400).then(() => {
        setTimeout(() => {
          navigation.goBack();
        }, 50);
      });
    });
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Background image with animation */}
        <Animated.Image
          source={require('../../assets/images/background.png')}
          style={[
            styles.backgroundImage,
            {
              transform: [{ translateY: backgroundAnim }],
            },
          ]}
          resizeMode="cover"
        />

        {/* Player count buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonsOpacity,
              transform: [{ scale: buttonsScale }],
            },
          ]}
        >
          <ImageButton
            imageSource={require('../../assets/images/2players.png')}
            onPress={() => handlePlayerCountSelect(2)}
            style={styles.button}
          />

          <ImageButton
            imageSource={require('../../assets/images/3players.png')}
            onPress={() => handlePlayerCountSelect(3)}
            style={styles.button}
          />

          <ImageButton
            imageSource={require('../../assets/images/4players.png')}
            onPress={() => handlePlayerCountSelect(4)}
            style={styles.button}
          />
        </Animated.View>

        {/* Restart button in bottom left corner */}
        <Animated.View
          style={[
            styles.restartButtonContainer,
            {
              opacity: buttonsOpacity,
              transform: [{ scale: buttonsScale }],
            },
          ]}
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


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b0c550',
  },
  backgroundImage: {
    position: 'absolute',
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    top: 0,
    left: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%',  // Buttons positioned lower on screen
    width: '100%',
    alignItems: 'center',
    gap: 0,
  },
  button: {
    width: width * 0.35,
    height: width * 0.20,
    marginVertical: -10,   // Reduz espaço entre botões
  },
  restartButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  restartButton: {
    width: 60,
    height: 60,
  },
});
