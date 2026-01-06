import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Dimensões da imagem de background (786x2190)
export const BACKGROUND_WIDTH = screenWidth;
export const BACKGROUND_HEIGHT = screenWidth * (2190 / 786);

// Offset para fazer o fundo da imagem coincidir com o fundo da tela
// Quando translateY = -backgroundOffset, o fundo da imagem alinha com o fundo da tela
export const BACKGROUND_OFFSET = BACKGROUND_HEIGHT - screenHeight;
