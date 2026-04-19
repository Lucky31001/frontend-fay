import { requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import type { AuthResponse, User } from '@/types/types';
import { storage } from '@/utils/storage';

export const login = async (payload: User): Promise<AuthResponse> => {
  const data = await requestPost(API_URL.LOGIN, payload);

  if (data.refresh_token) storage.setItem('refresh_token', data.refresh_token);
  if (data.access_token) storage.setItem('access_token', data.access_token);

  return data;
};

export const register = async (payload: User): Promise<AuthResponse> => {
  const data = await requestPost(API_URL.REGISTER, payload);

  if (data.refresh_token) storage.setItem('refresh_token', data.refresh_token);
  if (data.access_token) storage.setItem('access_token', data.access_token);

  return data;
};
