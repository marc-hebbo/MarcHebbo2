import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Moon, Sun, LogOut } from 'lucide-react-native';
import { useThemeStore } from '../stores/themeStore';
import { styles } from './styles';

type RootStackParamList = {
  Login: undefined;
  SignUp: { email: string };
  Verification: undefined;
  ProductList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();
const { theme, toggleTheme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyApp</Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={toggleTheme} style={styles.icon}>
          {isDarkMode ? <Sun size={24} color="white" /> : <Moon size={24} color="white" />}
        </TouchableOpacity>

        {isLoggedIn && (
          <TouchableOpacity onPress={handleLogout} style={styles.icon}>
            <LogOut size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Navbar;