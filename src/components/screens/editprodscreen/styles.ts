import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },

label: {
fontWeight: 'bold',
marginBottom: 4,
marginTop: 12,
},
input: {
borderWidth: 1,
borderColor: '#aaa',
borderRadius: 6,
padding: 8,
},
error: {
color: 'red',
},
imageWrapper: {
marginRight: 12,
position: 'relative',
},
image: {
width: 80,
height: 80,
borderRadius: 6,
backgroundColor: '#ddd',
justifyContent: 'center',
alignItems: 'center',
},
removeIcon: {
position: 'absolute',
top: -8,
right: -8,
backgroundColor: '#f00',
borderRadius: 10,
padding: 2,
},
addImageText: {
fontSize: 24,
color: '#666',
textAlign: 'center',
lineHeight: 80,
},
map: {
height: 200,
borderRadius: 6,
marginTop: 8,
},
submitButton: {
backgroundColor: '#007bff',
padding: 14,
borderRadius: 6,
marginTop: 24,
},
submitButtonText: {
color: '#fff',
textAlign: 'center',
fontWeight: 'bold',
},
});