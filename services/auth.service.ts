import * as SecureStore from 'expo-secure-store';
import { requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import type {LoginResponse, RegisterResponse} from '@/types/api.types';

export const login = async (payload: any): Promise<LoginResponse> => {
  const data: LoginResponse = (await requestPost(API_URL.LOGIN, payload))

  if (data.refresh_token) await SecureStore.setItemAsync('refresh_token', data.refresh_token);
  if (data.access_token) await SecureStore.setItemAsync('access_token', data.access_token);
  if (data.role) await SecureStore.setItemAsync('role', data.role);

  return data;
};

export const register = async (payload: any): Promise<RegisterResponse> => {
  const data = (await requestPost(API_URL.REGISTER, payload))

  if (data.refresh_token) await SecureStore.setItemAsync('refresh_token', data.refresh_token);
  if (data.access_token) await SecureStore.setItemAsync('access_token', data.access_token);
  if (data.role) await SecureStore.setItemAsync('role', data.role);
  
  return data;
};
