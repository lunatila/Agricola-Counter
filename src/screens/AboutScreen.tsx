import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useBackground } from '../context/BackgroundContext';
import { useAndroidNavBar, useContentAnimation } from '../hooks';
import { getBackgroundSize } from '../constants/background';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

type AboutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'About'>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { backgroundAnim, animateBackground } = useBackground();

  useAndroidNavBar();

  const { opacity, scale, show, hide } = useContentAnimation();

  const bg = getBackgroundSize();

  useFocusEffect(
    React.useCallback(() => {
      show();
    }, [show])
  );

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

        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={{ opacity, transform: [{ scale }] }}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>🌱 About Agricola Counter</Text>

              <Text style={styles.description}>
                Welcome to your new essential tool in the journey to build the best farm!
                Agricola Counter was created so you can focus on planning your farm,
                leaving the tedious counting of resources and points to us.
              </Text>

              <Text style={styles.description}>
                Simplified Resource Control: Track all your resources (wood, clay, stone, food,
                etc.) quickly and intuitively. Never lose count of your sheep or grain again!
              </Text>

              <Text style={styles.description}>
                Dynamic and Final Scoreboard: Record your buildings, animals, and crops for an
                instant score calculation. See the final ranking (with suspense) and discover who
                really built the most prosperous farm.
              </Text>

              <Text style={styles.description}>
                This app is a fan project.
              </Text>

              {/* <Text style={styles.appInfo}>Agricola Counter | Version 1.0.0</Text> */}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Back button is outside the ScrollView so position: absolute works correctly. */}
        <Animated.View style={[styles.backButtonContainer, { opacity, transform: [{ scale }] }]}>
          <ImageButton
            imageSource={require('../../assets/images/restart_button.png')}
            onPress={handleGoBack}
            style={styles.backButton}
            imageStyle={styles.backButton}
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
  content: {
    flexGrow: 1,
    padding: s(20),
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: s(15),
    padding: s(20),
    marginTop: '90%',
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: s(15),
    textAlign: 'center',
  },
  description: {
    fontSize: s(16),
    color: '#333',
    lineHeight: s(24),
    marginBottom: s(15),
    textAlign: 'justify',
  },
  appInfo: {
    fontSize: s(14),
    color: '#666',
    textAlign: 'center',
    marginTop: s(20),
    fontStyle: 'italic',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: s(20),
    left: s(20),
  },
  backButton: {
    width: s(60),
    height: s(60),
  },
});
