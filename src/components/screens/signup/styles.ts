import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; 

const scaleSize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const scaleFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  topSafeArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  innerContainer: {
    flexGrow: 1, // 👈 Add this
    padding: scaleSize(20),
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: scaleFont(35),
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
    textAlign: 'center',
    fontFamily: 'Montserrat-Black',
    color: '#fff',
  },
  buttonContainer: {
    marginTop: scaleSize(24),
    alignItems: 'center',
  },
  linkText: {
    fontSize: scaleFont(17),
    marginTop: scaleSize(10),
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});
