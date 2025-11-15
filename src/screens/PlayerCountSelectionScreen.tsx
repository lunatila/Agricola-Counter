import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useGame } from '../context/GameContext';

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
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  // Animate buttons appearing when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset animations
      buttonsOpacity.setValue(0);
      buttonsScale.setValue(0);

      // Animate buttons appearing with hammer effect
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
      navigation.goBack();
    });
  };

  // Render player icons based on count
  const renderPlayerIcons = (count: number) => {
    return (
      <View style={styles.playerIconsContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <Image
            key={index}
            source={require('../../assets/images/player_icon.png')}
            style={styles.playerIcon}
            resizeMode="contain"
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: buttonsOpacity,
              transform: [{ scale: buttonsScale }],
            },
          ]}
        >
        {/* Title */}
        <Text style={styles.title}>Selecione o número de jogadores</Text>

        {/* Player count buttons */}
        <View style={styles.buttonContainer}>
          <ImageButton
            imageSource={require('../../assets/images/play_button.png')}
            onPress={() => handlePlayerCountSelect(2)}
            style={styles.button}
          >
            {renderPlayerIcons(2)}
          </ImageButton>

          <ImageButton
            imageSource={require('../../assets/images/play_button.png')}
            onPress={() => handlePlayerCountSelect(3)}
            style={styles.button}
          >
            {renderPlayerIcons(3)}
          </ImageButton>

          <ImageButton
            imageSource={require('../../assets/images/play_button.png')}
            onPress={() => handlePlayerCountSelect(4)}
            style={styles.button}
          >
            {renderPlayerIcons(4)}
          </ImageButton>
        </View>

        {/* Back button */}
        <View style={styles.backButtonContainer}>
          <ImageButton
            imageSource={require('../../assets/images/exit_button.png')}
            text="Voltar"
            onPress={handleGoBack}
            style={styles.backButton}
          />
        </View>
      </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b0c550',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: 250,
    height: 60,
  },
  playerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  playerIcon: {
    width: 30,
    height: 30,
  },
  backButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    width: 150,
    height: 50,
  },
});
