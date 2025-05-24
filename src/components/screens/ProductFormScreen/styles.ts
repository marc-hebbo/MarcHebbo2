import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const scaleFont = (size: number) => size * fontScale;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingBottom: 50,
  },
  header: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Montserrat-Black',
    marginVertical: 16,
  },
  label: {
    fontSize: scaleFont(16),
    fontFamily: 'Montserrat-Black',
    color: '#e2e8f0',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: scaleFont(16),
    fontFamily: 'Montserrat-Black',
    color: '#000000',
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: scaleFont(13),
    fontFamily: 'Montserrat-Black',
    marginTop: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: width / 5,
    height: width / 5,
    borderRadius: 6,
  },
  trashIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 999,
    padding: 4,
    zIndex: 1,
  },
  addImageButton: {
    width: width / 5,
    height: width / 5,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addImageText: {
    fontSize: scaleFont(28),
    color: '#94a3b8',
    fontFamily: 'Montserrat-Black',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginTop: 16,
    marginBottom: 10,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  locationButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Black',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: scaleFont(18),
    fontFamily: 'Montserrat-Black',
    color: '#ffffff',
    textAlign: 'center',
  },
});
