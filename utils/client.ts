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
  } catch (e) {
    console.warn('Erreur récupération token', e);
  }
  return config;
});

export default client;
