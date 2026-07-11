import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para agregar token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await EncryptedStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor para manejar refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await EncryptedStorage.getItem('refresh_token');
        const response = await axios.post(
          `${process.env.API_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const { access_token, refresh_token } = response.data;

        await EncryptedStorage.setItem('access_token', access_token);
        await EncryptedStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        await EncryptedStorage.removeItem('access_token');
        await EncryptedStorage.removeItem('refresh_token');
        // Navigate to login (handled by auth context)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
