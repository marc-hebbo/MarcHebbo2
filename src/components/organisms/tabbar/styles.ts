import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375; // Base width for scaling, e.g., iPhone 11

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: normalize(12),
    paddingBottom: normalize(16),
  },
  tabButton: {
    alignItems: 'center',
  },
});
