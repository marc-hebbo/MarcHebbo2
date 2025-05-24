import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const baseWidth = 375;

const scaleSize = (size: number) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const scaleFont = (size: number) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleSize(50),   
    paddingBottom: scaleSize(20), 
    justifyContent: 'center',    
    alignItems: 'center',        
  },
  inner: {
    alignItems: 'center',
    gap: scaleSize(20),
    width: '100%',
  },
  title: {
    fontSize: scaleFont(28),
    fontFamily: 'Montserrat-Black',
    color: '#222',
    textAlign: 'center',
    flexShrink: 1,    
  },
  subtitle: {
    fontSize: scaleFont(18),
    color: '#555',
    textAlign: 'center',
    flexShrink: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scaleSize(10),
    flexWrap: 'wrap',   
  },
  otpInput: {
    width: (SCREEN_WIDTH - 2 * scaleSize(20) - 5 * scaleSize(10)) / 6,
    height: scaleSize(60),
    fontSize: scaleFont(24),
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: scaleSize(10),
    backgroundColor: '#fff',
    paddingVertical: scaleSize(10),
    marginVertical: scaleSize(20),
    fontFamily: 'Poppins-Regular',
  },
});
