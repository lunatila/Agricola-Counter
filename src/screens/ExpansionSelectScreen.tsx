import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { RootStackParamList } from '../types';
import { ImageButton } from '../components';
import { useGame } from '../context/GameContext';
import { useBackground } from '../context/BackgroundContext';
import { BACKGROUND_WIDTH, BACKGROUND_HEIGHT } from '../constants/background';

type ExpansionSelectScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ExpansionSelect'
>;

interface ExpansionSelectScreenProps {
    navigation: ExpansionSelectScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export const ExpansionSelectScreen: React.FC<ExpansionSelectScreenProps> = ({ navigation }) => {
    const { gameState, setExpansion } = useGame();
    const { isFarmersOfTheMoor } = gameState;
    const { backgroundAnim, animateBackground } = useBackground();

    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Hide navigation bar on Android
        if (Platform.OS === 'android') {
            NavigationBar.setVisibilityAsync('hidden');
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Coming from MainMenu (0) -> animate to -100
            animateBackground(-100, 600);

            contentOpacity.setValue(0);
            contentScale.setValue(0);

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
        }, [animateBackground, contentOpacity, contentScale])
    );

    const handleNext = () => {
        // Animate content disappearing
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
            // Navigate to PlayerCountSelection (which expects background at -200)
            animateBackground(-200, 600).then(() => {
                setTimeout(() => {
                    navigation.navigate('PlayerCountSelection');
                }, 50);
            });
        });
    };

    const handleBack = () => {
        // Animate content disappearing
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
            // Animate background back to 0 (MainMenu)
            animateBackground(0, 600).then(() => {
                setTimeout(() => {
                    navigation.goBack();
                }, 50);
            });
        });
    };

    const toggleExpansion = () => {
        setExpansion(!isFarmersOfTheMoor);
    };

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.container}>
                {/* Background image */}
                <Animated.Image
                    source={require('../../assets/images/background.png')}
                    style={[
                        styles.backgroundImage,
                        {
                            transform: [{ translateY: backgroundAnim }],
                        },
                    ]}
                    resizeMode="cover"
                />

                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: contentOpacity,
                            transform: [{ scale: contentScale }],
                        },
                    ]}
                >
                    {/* Expansion Item Row */}
                    <View style={styles.expansionRow}>
                        {/* Expansion Block with Text */}
                        <View style={styles.expansionBlockContainer}>
                            <Image
                                source={require('../../assets/images/expansion_block.png')}
                                style={styles.expansionBlockImage}
                                resizeMode="stretch"
                            />

                            <View style={styles.expansionTextContainer}>
                                {/* Sombra do texto */}
                                <Text style={styles.expansionTextShadow}>
                                    Farmers of the{'\n'}Moor
                                </Text>
                                {/* Outline do texto */}
                                <Text style={styles.expansionTextOutline}>
                                    Farmers of the{'\n'}Moor
                                </Text>
                            </View>
                        </View>

                        {/* Toggle Button */}
                        <TouchableOpacity onPress={toggleExpansion} style={styles.toggleButton}>
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

                {/* Navigation Buttons */}
                <Animated.View
                    style={[
                        styles.navigationContainer,
                        {
                            opacity: contentOpacity,
                        },
                    ]}
                >
                    {/* Botão Restart (Back) */}
                    <ImageButton
                        imageSource={require('../../assets/images/restart_button.png')}
                        onPress={handleBack}
                        style={styles.navButton}
                    />

                    {/* Botão Go (Forward) */}
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
        backgroundColor: '#b0c550',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: BACKGROUND_WIDTH,
        height: BACKGROUND_HEIGHT,
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
        gap: 20,
    },
    expansionBlockContainer: {
        width: width * 0.6,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
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
        position: 'relative', // Relative to containing block
    },
    expansionTextShadow: {
        position: 'absolute',
        fontFamily: 'Shadow',
        fontSize: 25, // Slightly smaller to fit 2 lines
        color: '#f9c32b',
        textAlign: 'center',
    },
    expansionTextOutline: {
        position: 'absolute',
        fontFamily: 'Outline',
        fontSize: 25, // Slightly smaller to fit 2 lines
        color: '#000000',
        textAlign: 'center',
    },
    toggleButton: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleImage: {
        width: '100%',
        height: '100%',
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 30, // Mude este valor para ajustar a posição vertical dos botões
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    navButton: {
        width: 80,
        height: 80,
    },
});
