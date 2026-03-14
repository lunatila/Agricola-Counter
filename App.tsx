import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Image, Platform } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as ScreenOrientation from 'expo-screen-orientation';
import { WebDeviceFrame } from './src/web/WebDeviceFrame';
import { GameProvider } from './src/context/GameContext';
import { AudioProvider } from './src/context/AudioContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { RootStackParamList } from './src/types';
import { Colors } from './src/constants/colors';
import {
  MainMenuScreen,
  AboutScreen,
  PlayerCountSelectionScreen,
  GameScreen,
  ScoreScreen,
  ExpansionSelectScreen,
} from './src/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

function cacheImages(images: number[]): Promise<void>[] {
  return images.map((image) =>
    typeof image === 'string'
      ? Image.prefetch(image)
      : Asset.fromModule(image).downloadAsync()
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAsync() {
      try {
        if (Platform.OS !== 'web') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }

        await Font.loadAsync({
          Outline: require('./assets/fonts/Outline.otf'),
          Shadow: require('./assets/fonts/Shadow.otf'),
        });

        await Promise.all(
          cacheImages([
            // Resource icons
            require('./assets/images/soil_icon.png'),
            require('./assets/images/fence_icon.png'),
            require('./assets/images/grain_icon.png'),
            require('./assets/images/vegetable_icon.png'),
            require('./assets/images/sheep_icon.png'),
            require('./assets/images/boar_icon.png'),
            require('./assets/images/cattle_icon.png'),
            require('./assets/images/empty_icon.png'),
            require('./assets/images/fencedStable_icon.png'),
            require('./assets/images/clayHouse_icon.png'),
            require('./assets/images/stoneHouse_icon.png'),
            require('./assets/images/initialFamily_icon.png'),
            require('./assets/images/3family_icon.png'),
            require('./assets/images/4family_icon.png'),
            require('./assets/images/5family_icon.png'),
            require('./assets/images/bonus_icon.png'),
            require('./assets/images/starve_icon.png'),
            // UI buttons
            require('./assets/images/play_button.png'),
            require('./assets/images/about_button.png'),
            require('./assets/images/exit_button.png'),
            require('./assets/images/home_button.png'),
            require('./assets/images/restart_button.png'),
            require('./assets/images/sound_button.png'),
            require('./assets/images/muted_button.png'),
            require('./assets/images/forward_button.png'),
            require('./assets/images/backward_button.png'),
            require('./assets/images/2players.png'),
            require('./assets/images/3players.png'),
            require('./assets/images/4players.png'),
            // Leaderboard panels
            require('./assets/images/1place.png'),
            require('./assets/images/2place.png'),
            require('./assets/images/3place.png'),
            require('./assets/images/4place.png'),
            // Backgrounds & misc
            require('./assets/images/background.png'),
            require('./assets/images/backgroundMain.png'),
            require('./assets/images/expansion_block.png'),
            require('./assets/images/toggle_off.png'),
            require('./assets/images/toggle_on.png'),
            require('./assets/images/go_button.png'),
            require('./assets/images/about_icon.png'),
          ])
        );
      } catch (e) {
        console.warn('Failed to preload resources:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    loadResourcesAsync();

    if (Platform.OS === 'web') return;

    // Re-lock orientation if the system changes it (important on tablets).
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    });

    return () => ScreenOrientation.removeOrientationChangeListener(subscription);
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.appBackground }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const appTree = (
    <BackgroundProvider>
      <AudioProvider>
        <GameProvider>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                primary: Colors.primary,
                background: Colors.appBackground,
                card: Colors.appBackground,
                text: Colors.black,
                border: 'transparent',
                notification: '#ff0000',
              },
            }}
          >
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="MainMenu"
              screenOptions={{
                headerShown: false,
                animation: 'none',
                animationTypeForReplace: 'pop',
                gestureEnabled: false,
                contentStyle: { backgroundColor: Colors.appBackground },
              }}
            >
              <Stack.Screen name="MainMenu" component={MainMenuScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="ExpansionSelect" component={ExpansionSelectScreen} />
              <Stack.Screen name="PlayerCountSelection" component={PlayerCountSelectionScreen} />
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
      </AudioProvider>
    </BackgroundProvider>
  );

  if (Platform.OS === 'web') {
    return <WebDeviceFrame>{appTree}</WebDeviceFrame>;
  }

  return appTree;
}
