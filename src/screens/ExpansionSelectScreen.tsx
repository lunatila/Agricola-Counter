import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ImageButton, StyledText } from '../components';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { useAndroidNavBar, useContentAnimation } from '../hooks';
import { getBackgroundSize } from '../constants/background';
import { Colors } from '../constants/colors';
import { s } from '../utils/scale';

type ExpansionSelectScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ExpansionSelect'
>;

interface ExpansionSelectScreenProps {
  navigation: ExpansionSelectScreenNavigationProp;
}

export const ExpansionSelectScreen: React.FC<ExpansionSelectScreenProps> = ({ navigation }) => {
  const { gameState, setExpansion } = useGame();
  const { isFarmersOfTheMoor } = gameState;
  const { backgroundAnim, animateBackground } = useBackground();

  useAndroidNavBar();

  const { opacity, scale, show, hide } = useContentAnimation();

  const bg = getBackgroundSize();

  useFocusEffect(
    React.useCallback(() => {
      animateBackground(-100, 600);
      show();
    }, [animateBackground, show])
  );

  const handleNext = () => {
    hide(() => {
      animateBackground(-200, 600).then(() => {
        setTimeout(() => navigation.navigate('PlayerCountSelection'), 50);
      });
    });
  };

  const handleBack = () => {
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

        <Animated.View
          style={[styles.contentContainer, { opacity, transform: [{ scale }] }]}
        >
          <View style={styles.expansionRow}>
            {/* Expansion block — width is responsive to current device width */}
            <View style={styles.expansionBlockContainer}>
              <Image
                source={require('../../assets/images/expansion_block.png')}
                style={styles.expansionBlockImage}
                resizeMode="stretch"
              />
              <View style={styles.expansionTextContainer}>
                <StyledText style={styles.expansionText}>
                  {'Farmers of the\nMoor'}
                </StyledText>
              </View>
            </View>

            <TouchableOpacity onPress={() => setExpansion(!isFarmersOfTheMoor)} style={styles.toggleButton}>
              <Image
                source={
                  isFarmersOfTheMoor
                    ? require('../../assets/images/toggle_on.png')
                    : require('../../assets/images/toggle_off.png')
                }
                style={styles.toggleImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.navigationContainer, { opacity }]}>
          <ImageButton
            imageSource={require('../../assets/images/restart_button.png')}
            onPress={handleBack}
            style={styles.navButton}
          />
          <ImageButton
            imageSource={require('../../assets/images/go_button.png')}
            onPress={handleNext}
            style={styles.navButton}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  contentContainer: {
    position: 'absolute',
    bottom: '25%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expansionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(20),
  },
  expansionBlockContainer: {
    width: s(480),
    height: s(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  expansionText: {
    fontSize: s(25),
  },
  expansionBlockImage: {
    width: '80%',
    height: '100%',
    position: 'absolute',
  },
  expansionTextContainer: {
    width: '80%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  toggleButton: {
    width: s(80),
    height: s(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleImage: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: s(30),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: s(40),
  },
  navButton: {
    width: s(80),
    height: s(80),
  },
});
