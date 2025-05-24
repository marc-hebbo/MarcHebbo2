import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingBottom: 40,
  },
  changePhotoText: {
  marginTop: 8,
  textAlign: 'center',
  color: '#007AFF',
  fontSize: 14,
},
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 16,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});
