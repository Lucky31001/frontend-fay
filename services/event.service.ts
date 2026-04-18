import { requestGet, requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import { Event } from '@/types/api.types';

export const List_event = async (): Promise<Event[]> => {
  const data = await requestGet(API_URL.EVENT);
  return data;
};
