import { StyleSheet } from 'react-native';

export const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    columnWrapper: {
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    listContent: {
      paddingBottom: 20,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    paginationButton: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      marginHorizontal: 5,
      borderRadius: 5,
      backgroundColor: isDark ? '#333' : '#eee',
    },
    paginationText: {
      fontSize: 16,
      fontFamily: 'Montserrat-Black',
      color: isDark ? '#fff' : '#000',
    },
    activePage: {
      backgroundColor: isDark ? '#666' : '#ddd',
    },
    activePageText: {
      color: isDark ? '#fff' : '#000',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });