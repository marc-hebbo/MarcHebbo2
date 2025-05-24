import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
      padding: 20,
    },
    topSafeArea: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    },
    innerContainer: {
      padding: scaleSize(20),
      justifyContent: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, 
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    title: {
      fontSize: 32,
      fontFamily: 'Montserrat-Black',
      color: isDark ? '#fff' : '#000',
      marginBottom: 32,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Montserrat-Black',
      color: isDark ? '#ccc' : '#666',
      marginBottom: 24,
      textAlign: 'center',
    },
    form: {
      gap: 16,
    },
    footer: {
      marginTop: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'Montserrat-Black',
      color: isDark ? '#ccc' : '#666',
    },
    link: {
      color: '#007bff',
    },
    buttonContainer: {
      marginTop: scaleSize(24), 
      alignItems: 'center',
    },
    linkText: {
      fontSize: scaleFont(17),  
      marginTop: scaleSize(10), 
      color: '#fff',
      textAlign: 'center',
      fontFamily: 'Poppins-SemiBold',
    },
  });
