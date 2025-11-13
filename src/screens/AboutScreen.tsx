import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { CustomButton } from '../components';

type AboutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'About'
>;

interface AboutScreenProps {
  navigation: AboutScreenNavigationProp;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#4A7C59', '#6B9F7D', '#8BC19F']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back button */}
        <View style={styles.backButtonContainer}>
          <CustomButton
            title="← Voltar"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>

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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    minWidth: 120,
    paddingVertical: 10,
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
});
