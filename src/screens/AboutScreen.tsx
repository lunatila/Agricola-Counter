import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useBackground } from '../context/BackgroundContext';
import { BACKGROUND_WIDTH, BACKGROUND_HEIGHT, BACKGROUND_OFFSET } from '../constants/background';

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'About'
>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { backgroundAnim, animateBackground } = useBackground();
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  // Animate content appearing when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Background já deve estar em -1000 (saindo do MainMenu)
      // Apenas animar o conteúdo aparecendo
      contentOpacity.setValue(0);
      contentScale.setValue(0);

      // Animate content appearing with hammer effect
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }, [contentOpacity, contentScale])
  );

  const handleGoBack = () => {
    // Animate content disappearing and background descending in parallel
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animar background descendo para 0 antes de voltar
      animateBackground(0, 600).then(() => {
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
        {/* Background image único */}
        <Animated.Image
          source={require('../../assets/images/background.png')}
          style={[
            styles.backgroundImage,
            {
              transform: [{ translateY: backgroundAnim }],
            },
          ]}
          resizeMode="stretch"
        />
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ scale: contentScale }],
            }}
          >


            {/* About text */}
            <View style={styles.textContainer}>
              {/* TÍTULO PRINCIPAL */}
              <Text style={styles.title}>🌱 About Agricola Counter</Text>

              {/* INTRODUÇÃO E PROPÓSITO - Com toque temático */}
              <Text style={styles.description}>
                Welcome to your new essential tool in the journey to build the best farm!
                Agricola Counter was created so you can focus on planning your farm,
                leaving the tedious counting of resources and points to us.
              </Text>

              {/* PRINCIPAIS FUNCIONALIDADES */}
              <Text style={styles.description}>
                Simplified Resource Control: Track all your resources (wood, clay, stone, food, etc.) quickly and intuitively. Never lose count of your sheep or grain again!
                {/* Você pode substituir estes por bullet points programáticos se o seu estilo suportar */}
              </Text>
              <Text style={styles.description}>
                Dynamic and Final Scoreboard: Record your buildings, animals, and crops for an instant score calculation. See the final ranking (with suspense) and discover who really built the most prosperous farm.
              </Text>

              {/* SEÇÃO DE CRÉDITOS E INFORMAÇÕES */}
              <Text style={styles.description}>
                This app is a fan project, made with passion by the Agricola community.
                It aims exclusively to enhance the game experience.
              </Text>

              {/* INFORMAÇÕES DA VERSÃO */}
              <Text style={styles.appInfo}>
                Agricola Counter | Version 1.0.0
              </Text>
            </View>
          </Animated.View>

          {/* Restart button in bottom left corner */}
          <Animated.View
            style={[
              styles.restartButtonContainer,
              {
                opacity: contentOpacity,
                transform: [{ scale: contentScale }],
              },
            ]}
          >
            <ImageButton
              imageSource={require('../../assets/images/restart_button.png')}
              onPress={handleGoBack}
              style={styles.restartButton}
              imageStyle={styles.restartButtonImage}
            />
          </Animated.View>
        </ScrollView>
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
    position: 'absolute',
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT,
    top: 0,
    left: 0,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },

  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginTop: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A7C59',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  appInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
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
  restartButtonImage: {
    width: 60,
    height: 60,
  },
});
