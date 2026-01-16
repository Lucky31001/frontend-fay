import axios from 'axios';
import { storage } from '@/utils/storage';
import { API_URL } from '@/constant/urls';

const client = axios.create({
  baseURL: 'http://10.57.33.91:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (config) => {
  try {
    const url = String(config?.url ?? '');
    const isAuthRoute = [API_URL.LOGIN, API_URL.REGISTER, API_URL.TOKEN_REFRESH].some((p) =>
      url.includes(p),
    );
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
