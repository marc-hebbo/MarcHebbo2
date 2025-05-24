// src/organisms/ProductDetail/styles.ts
import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

const scaleSize = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));
const scaleFont = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

export const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      padding: scaleSize(16),
      backgroundColor: theme === 'dark' ? '#1A1C1E' : '#f5f5f5',
      alignItems: 'center',
    },
    swiperContainer: {
      width: '100%',
      height: IMAGE_HEIGHT + scaleSize(32),
      marginBottom: scaleSize(16),
    },
    swiperBorder: {
      height: scaleSize(4),
      width: '100%',
      backgroundColor: theme === 'dark' ? '#4DA6FF' : '#007bff',
      alignSelf: 'center',
      borderRadius: scaleSize(2),
      marginTop: scaleSize(8),
    },
    imageWrapper: {
  width: '100%',
  height: IMAGE_HEIGHT,
  borderRadius: scaleSize(12),
  overflow: 'hidden',  // clips image to border radius
  borderWidth: 3,
  borderColor: theme === 'dark' ? '#444' : '#ccc',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
},
image: {
  width: '100%',
  height: IMAGE_HEIGHT,
  resizeMode: 'contain',  // keeps whole image visible, may add blank spaces
},

    noImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
    },
    content: {
      width: '100%',
    },
    title: {
      fontSize: scaleFont(24),
      marginBottom: scaleSize(8),
      color: theme === 'dark' ? '#F1F3F4' : '#333',
      fontFamily: 'Poppins-Bold',
    },
    price: {
      fontSize: scaleFont(20),
      color: theme === 'dark' ? '#4DA6FF' : '#007bff',
      marginBottom: scaleSize(12),
      fontFamily: 'Poppins-SemiBold',
    },
    description: {
      fontSize: scaleFont(16),
      lineHeight: scaleSize(24),
      color: theme === 'dark' ? '#CFCFCF' : '#444',
      marginBottom: scaleSize(20),
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
    },
    map: {
      width: '100%',
      height: scaleSize(200),
      borderRadius: scaleSize(12),
      marginBottom: scaleSize(20),
    },
    noLocationContainer: {
      padding: 16,
      alignItems: 'center',
    },
    ownerContainer: {
      width: '100%',
      marginBottom: scaleSize(20),
      alignItems: 'center',
      gap: scaleSize(8),
    },
    buttonContainer: {
      width: '100%',
      flexDirection: 'column',
      rowGap: scaleSize(16),
    },
  });
