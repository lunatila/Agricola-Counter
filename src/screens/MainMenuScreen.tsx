import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, StatusBar, BackHandler, Platform, Animated, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useAudio } from '../context/AudioContext';

type MainMenuScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MainMenu'
>;

interface MainMenuScreenProps {
  navigation: MainMenuScreenNavigationProp;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  navigation,
}) => {
  const { isMuted, toggleMute } = useAudio();
  const slideAnim = useRef(new Animated.Value(-1000)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsScale = useRef(new Animated.Value(0)).current;
  const soundButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  // Reset and animate when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset animations
      slideAnim.setValue(-1000);
      buttonsOpacity.setValue(0);
      buttonsScale.setValue(0);

      // Animate background sliding down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // After background animation, animate buttons appearing with hammer effect
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
      });
    }, [slideAnim, buttonsOpacity, buttonsScale])
  );

  const handleNavigation = (navigateFn: () => void) => {
    // Animate buttons disappearing first
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
      // Then animate background sliding up
      Animated.timing(slideAnim, {
        toValue: -1000,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        navigateFn();
      });
    });
  };

  const handleExit = () => {
    BackHandler.exitApp();
  };

  const handleSoundButtonPressIn = () => {
    Animated.spring(soundButtonScale, {
      toValue: 0.85,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleSoundButtonPressOut = () => {
    Animated.spring(soundButtonScale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Background image at the top with animation */}
        <Animated.Image
          source={require('../../assets/images/background.png')}
          style={[
            styles.backgroundImage,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          resizeMode="cover"
        />

        {/* Buttons at the bottom */}
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
            imageSource={require('../../assets/images/play_button.png')}
            text="Jogar"
            onPress={() => handleNavigation(() => navigation.navigate('PlayerCountSelection'))}
            style={styles.button}
            imageStyle={styles.playButtonImage}
          />

          <ImageButton
            imageSource={require('../../assets/images/exit_button.png')}
            text="Sair"
            onPress={handleExit}
            style={styles.button}
            imageStyle={styles.exitButtonImage}
          />
        </Animated.View>

        {/* About button in bottom left corner */}
        <Animated.View
          style={[
            styles.aboutButtonContainer,
            {
              opacity: buttonsOpacity,
              transform: [{ scale: buttonsScale }],
            },
          ]}
        >
          <ImageButton
            imageSource={require('../../assets/images/about_button.png')}
            onPress={() => handleNavigation(() => navigation.navigate('About'))}
            style={styles.aboutButton}
            imageStyle={styles.aboutButtonImage}
          />
        </Animated.View>

        {/* Sound toggle button in bottom right corner */}
        <Animated.View
          style={[
            styles.soundButtonContainer,
            {
              opacity: buttonsOpacity,
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: Animated.multiply(buttonsScale, soundButtonScale) }] }}>
            <TouchableOpacity
              onPress={toggleMute}
              onPressIn={handleSoundButtonPressIn}
              onPressOut={handleSoundButtonPressOut}
              activeOpacity={1}
              style={styles.soundButton}
            >
              <Image
                source={
                  isMuted
                    ? require('../../assets/images/muted_button.png')
                    : require('../../assets/images/sound_button.png')
                }
                style={styles.soundButtonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
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
  backgroundImage: {
    width: '100%',
    height: '80%',
    top: 0,
    left: 0
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '15%',
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: 250,
    height: 80,
  },
  playButtonImage: {
    width: 250,
    height: 70,
  },
  exitButtonImage: {
    width: 250,
    height: 60,
  },
  aboutButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  aboutButton: {
    width: 60,
    height: 60,
  },
  aboutButtonImage: {
    width: 60,
    height: 60,
  },
  soundButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  soundButton: {
    width: 60,
    height: 60,
  },
  soundButtonImage: {
    width: 60,
    height: 60,
  },
});
