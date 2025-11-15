import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, Platform, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'About'
>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  // Animate content appearing when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset animations
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
    // Animate content disappearing before navigation
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
      navigation.goBack();
    });
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          }}
        >
        {/* About icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/about_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* About text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Sobre Agricola</Text>
          <Text style={styles.description}>
            Agricola é um jogo de tabuleiro em que os jogadores administram
            fazendas, construem cercas, criam animais e alimentam suas famílias.
          </Text>
          <Text style={styles.description}>
            Este aplicativo foi criado para facilitar a contagem de recursos e
            pontuação durante suas partidas de Agricola.
          </Text>
          <Text style={styles.appInfo}>
            Agricola Counter v1.0.0
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
  content: {
    flexGrow: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  icon: {
    width: 150,
    height: 150,
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
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
