import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scaleFont = (size: number) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const scaleSize = (size: number) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const LIST_PADDING = scaleSize(16);
const SPACE_BETWEEN = scaleSize(12);
const CARD_WIDTH = (SCREEN_WIDTH - 2 * LIST_PADDING - SPACE_BETWEEN) / 2;

export const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      marginBottom: SPACE_BETWEEN,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333' : '#ddd',
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: theme === 'dark' ? '#0a1a2f' : '#fff',
      elevation: 3,
      flexDirection: 'column',
    },
    imageContainer: {
      width: '100%',
      height: CARD_WIDTH,
      backgroundColor: theme === 'dark' ? '#0a1a2f' : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
    details: {
      padding: scaleSize(8),
      alignItems: 'center',
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: scaleFont(16),
      marginBottom: scaleSize(4),
      textAlign: 'center',
      fontFamily: 'Montserrat-Black',
      flexShrink: 1,
      color: theme === 'dark' ? 'white' : 'black',
    },
    price: {
      fontSize: scaleFont(14),
      fontFamily: 'Montserrat-Black',
      color: '#007bff',
      textAlign: 'center',
      marginTop: 'auto',
    },
  });
