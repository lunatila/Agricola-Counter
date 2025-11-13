import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { CustomButton } from '../components';

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
  return (
    <LinearGradient
      colors={['#4A7C59', '#6B9F7D', '#8BC19F']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo_main_menu.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Agricola Counter</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Jogar"
            onPress={() => navigation.navigate('PlayerCountSelection')}
            style={styles.button}
          />

          <CustomButton
            title="Sobre"
            onPress={() => navigation.navigate('About')}
            style={styles.button}
            variant="secondary"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
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
    minWidth: 250,
  },
});
