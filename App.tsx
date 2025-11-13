import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import { RootStackParamList } from './src/types';
import {
  MainMenuScreen,
  AboutScreen,
  PlayerCountSelectionScreen,
  GameScreen,
  ScoreScreen,
} from './src/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen
            name="PlayerCountSelection"
            component={PlayerCountSelectionScreen}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="ScoreScreen"
            component={ScoreScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
