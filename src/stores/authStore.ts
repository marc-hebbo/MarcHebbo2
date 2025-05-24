import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/axios';
import {jwtDecode } from 'jwt-decode';  

type AuthStatus = 'success' | 'unverified' | 'error';

type TokenPayload = {
  userId: string;
  email: string;  
  iat: number;
  exp: number;
};

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  email: string | null;   
  isLoggedIn: boolean;
  isVerified: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AuthStatus>;
  refreshAccessToken: () => Promise<string | null>;
  logout: () => Promise<void>;
  verify: () => void;
  restoreSession: () => Promise<void>;
  setLoggedIn: () => void;
  signUpSuccess: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  email: null,
  isLoggedIn: false,
  isVerified: false,
  isAuthLoading: true,

  login: async (email, password) => {
    console.log('[authStore] login() with', email);
    try {
      const response = await API.post('/api/auth/login', {
        email,
        password,
        token_expires_in: '1y',
      });

      const { accessToken, refreshToken, isVerified } = response.data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      const decoded = jwtDecode<TokenPayload>(accessToken);
      const verified = isVerified ?? true;

      set({
        accessToken,
        userId: decoded.userId,
        email,               
        isLoggedIn: true,
        isVerified: verified,
        isAuthLoading: false,
      });

      return verified ? 'success' : 'unverified';
    } catch (err: any) {
      const errBody = err.response?.data?.error || {};
      const { statusCode, message = '' } = errBody;

      console.log('[authStore] login error:', statusCode, message);

      const lowerMessage = message.toLowerCase();

      if (
        (statusCode === 403 || statusCode === 400) &&
        lowerMessage.includes('verify')
      ) {
        set({ isLoggedIn: true, isVerified: false });
        return 'unverified';
      }

      if (statusCode === 400 && lowerMessage.includes('already verified')) {
        set({ isLoggedIn: true, isVerified: true });
        return 'success';
      }

      set({ isLoggedIn: false, isVerified: false, isAuthLoading: false });
      return 'error';
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      userId: null,
      email: null,          
      isLoggedIn: false,
      isVerified: false,
      isAuthLoading: false,
    });
  },

  restoreSession: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const isLoggedIn = !!token;
      const isVerified = isLoggedIn ? true : false;

      let userId = null;
      let email: string | null = null;  

      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          userId = decoded.userId;
          email = decoded.email;    
        } catch (decodeError) {
          console.log('[authStore] Failed to decode token:', decodeError);
        }
      }

      set({
        accessToken: token,
        userId,
        email,
        isLoggedIn,
        isVerified,
        isAuthLoading: false,
      });
    } catch (err) {
      console.log('[authStore] restoreSession error:', err);
      set({ isAuthLoading: false });
    }
  },

  verify: () => set({ isVerified: true }),
  setLoggedIn: () => set({ isLoggedIn: true }),
  
  signUpSuccess: (email: string) =>
    set({
      email,
      isLoggedIn: true,
      isVerified: false,
      accessToken: null,
      userId: null,
    }),
    refreshAccessToken: async () => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
    if (!storedRefreshToken) throw new Error('No refresh token found');

    const response = await API.post('/api/auth/refresh-token', {
      refreshToken: storedRefreshToken,
      token_expires_in: '1y',
    });

    const { accessToken } = response.data.data;

    await AsyncStorage.setItem('accessToken', accessToken);

    const decoded = jwtDecode<TokenPayload>(accessToken);
        console.log('%c[REFRESH TOKEN] Success:', 'color: green', decoded);


    set(state => ({
      accessToken,
      userId: decoded.userId,
      isLoggedIn: true,
    }));

    return accessToken;
  } catch (err: any) {
  console.log('[authStore] Failed to refresh token:', err);

  const status = err?.response?.status;

  if (status === 401 || status === 403) {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      userId: null,
      isLoggedIn: false,
      isVerified: false,
    });
    return null;
  }
  console.warn('[authStore] Refresh token failed but not logging out due to transient error.');

  return null;
}

}

}));
