import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Image } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import * as ScreenOrientation from 'expo-screen-orientation';
import { GameProvider } from './src/context/GameContext';
import { AudioProvider } from './src/context/AudioContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { RootStackParamList } from './src/types';
import {
  MainMenuScreen,
  AboutScreen,
  PlayerCountSelectionScreen,
  GameScreen,
  ScoreScreen,
  ExpansionSelectScreen,
} from './src/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Preload all images
function cacheImages(images: any[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAsync() {
      try {
        // Lock screen orientation to portrait (works on phones and tablets)
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );

        // Load fonts
        await Font.loadAsync({
          'Outline': require('./assets/fonts/Outline.otf'),
          'Shadow': require('./assets/fonts/Shadow.otf'),
        });

        // Preload all images
        const imageAssets = cacheImages([
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
          // Button icons
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
          // Background images
          require('./assets/images/background.png'),
          require('./assets/images/backgroundMain.png'),
          require('./assets/images/expansion_block.png'),
          require('./assets/images/toggle_off.png'),
          require('./assets/images/toggle_on.png'),
          require('./assets/images/go_button.png'),
          // Other icons
          require('./assets/images/about_icon.png'),
          require('./assets/images/player_icon.png'),

        ]);

        await Promise.all(imageAssets);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    loadResourcesAsync();

    // Add listener to ensure orientation stays locked (important for tablets)
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Loading screen while resources load
  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#b0c550' }}>
        <ActivityIndicator size="large" color="#4A7C59" />
      </View>
    );
  }

  return (
    <BackgroundProvider>
      <AudioProvider>
        <GameProvider>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                primary: '#4A7C59',
                background: '#b0c550', // Ensure this matches your app background
                card: '#b0c550',
                text: '#000000',
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
                animation: 'none',  // Disable default animation to prevent flash
                animationTypeForReplace: 'pop',  // No animation when replacing
                gestureEnabled: false,  // Disable swipe gestures to prevent flash
                contentStyle: { backgroundColor: '#b0c550' },  // Consistent background
              }}
            >
              <Stack.Screen name="MainMenu" component={MainMenuScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="ExpansionSelect" component={ExpansionSelectScreen} />
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
      </AudioProvider>
    </BackgroundProvider>
  );
}
