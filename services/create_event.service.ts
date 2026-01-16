import { requestPost } from '@/utils/http';
import { API_URL } from '@/constant/urls';
import { APICreateEvent } from '@/types/api.types';

export const create_event = async (payload: any): Promise<APICreateEvent> => {
  console.log("payload : ", payload)
  const data = await requestPost(API_URL.CREATE_EVENT, payload);
  return data;
}