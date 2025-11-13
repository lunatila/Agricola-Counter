import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { CustomButton } from '../components';
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

  const handlePlayerCountSelect = (count: number) => {
    initializeGame(count);
    navigation.navigate('GameScreen', { playerCount: count });
  };

  return (
    <LinearGradient
      colors={['#4A7C59', '#6B9F7D', '#8BC19F']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Selecione o número de jogadores</Text>

        {/* Player count buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="2 Jogadores"
            onPress={() => handlePlayerCountSelect(2)}
            style={styles.button}
          />

          <CustomButton
            title="3 Jogadores"
            onPress={() => handlePlayerCountSelect(3)}
            style={styles.button}
          />

          <CustomButton
            title="4 Jogadores"
            onPress={() => handlePlayerCountSelect(4)}
            style={styles.button}
          />
        </View>

        {/* Back button */}
        <View style={styles.backButtonContainer}>
          <CustomButton
            title="← Voltar"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
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
    minWidth: 250,
  },
  backButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    minWidth: 150,
  },
});
