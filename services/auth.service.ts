import { requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import type { LoginResponse, RegisterResponse } from '@/types/api.types';
import { storage } from '@/utils/storage';

export const login = async (payload: any): Promise<LoginResponse> => {
  const data: LoginResponse = await requestPost(API_URL.LOGIN, payload);

  if (data.refresh_token) storage.setItem('refresh_token', data.refresh_token);
  if (data.access_token) storage.setItem('access_token', data.access_token);
  if (data.role) storage.setItem('role', data.role);

  return data;
};

export const register = async (payload: any): Promise<RegisterResponse> => {
  const data = await requestPost(API_URL.REGISTER, payload);

  if (data.refresh_token) storage.setItem('refresh_token', data.refresh_token);
  if (data.access_token) storage.setItem('access_token', data.access_token);
  if (data.role) storage.setItem('role', data.role);

  return data;
};
