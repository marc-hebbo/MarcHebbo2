import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

interface ThemeStore {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const STORAGE_KEY = 'APP_THEME';

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',

  toggleTheme: async () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, newTheme);
      return { theme: newTheme };
    });
  },

  setTheme: (theme) => {
    AsyncStorage.setItem(STORAGE_KEY, theme);
    set({ theme });
  },
}));

AsyncStorage.getItem(STORAGE_KEY).then((storedTheme) => {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    useThemeStore.getState().setTheme(storedTheme);
  }
});
