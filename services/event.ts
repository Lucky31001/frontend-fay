import { requestGet, requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import { Event, EventType } from '@/types/types';

export const get_event = async (): Promise<Event[]> => {
  return await requestGet(API_URL.EVENT);
};

export const get_event_type = async (): Promise<EventType[]> => {
  return await requestGet(API_URL.EVENT_TYPE);
};

export const create_event = async (payload: any, headers?: Record<string, any>): Promise<Event> => {
  return await requestPost(API_URL.EVENT, payload, headers);
};
