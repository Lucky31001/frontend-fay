import axios from 'axios';
import { storage } from '@/utils/storage';
import { API_URL } from '@/constant/urls';
import { API_BASE_URL } from '@/utils/config';

// Centralized API base URL from utils/config
console.log('API_BASE_URL used by axios:', API_BASE_URL);

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  try {
    const url = String(config?.url ?? '');
    const isAuthRoute = [API_URL.LOGIN, API_URL.REGISTER, API_URL.TOKEN_REFRESH].includes(url);
    if (isAuthRoute) return config;

    const token = await storage.getItem('access_token');
    if (token) {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    console.warn('Erreur récupération token');
  }
  return config;
});

// Intercept responses to handle 401 unauthorized globally
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const status = error?.response?.status;
      const originalRequest = error?.config ?? {};
      const url = String(originalRequest?.url ?? '');
      const isAuthRoute = [API_URL.LOGIN, API_URL.REGISTER, API_URL.TOKEN_REFRESH].includes(url);

      if (status === 401 && !isAuthRoute) {
        // Clear tokens and redirect to login
        try {
          await storage.removeItem('access_token');
          await storage.removeItem('refresh_token');
        } catch (e) {
          // ignore
        }

        try {
          // eslint-disable-next-line global-require
          const { router } = require('expo-router');
          if (router && typeof router.replace === 'function') {
            router.replace('/login');
          }
        } catch (e) {}
      }
    } catch (e) {}

    return Promise.reject(error);
  },
);

export default client;
