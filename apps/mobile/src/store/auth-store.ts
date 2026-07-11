import { create } from 'zustand';
import EncryptedStorage from 'react-native-encrypted-storage';

interface User {
  id: string;
  correo_institucional: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  rol?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, accessToken, refreshToken) => {
    try {
      await EncryptedStorage.setItem('access_token', accessToken);
      await EncryptedStorage.setItem('refresh_token', refreshToken);
      await EncryptedStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },

  logout: async () => {
    try {
      await EncryptedStorage.removeItem('access_token');
      await EncryptedStorage.removeItem('refresh_token');
      await EncryptedStorage.removeItem('user');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  loadAuth: async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('access_token');
      const userStr = await EncryptedStorage.getItem('user');
      
      if (accessToken && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken: await EncryptedStorage.getItem('refresh_token'),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      set({ isLoading: false });
    }
  },
}));
