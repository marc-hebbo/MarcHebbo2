import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const styles = StyleSheet.create({
  container: {
    height: normalize(50),
    backgroundColor: '#007bff', 
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 30, 
  },
  title: {
    fontSize: normalize(20),
    fontFamily: 'Montserrat-Black',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    gap: normalize(16),
  },
  icon: {
    padding: normalize(6),
  },
});
