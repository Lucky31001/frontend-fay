import { request } from './request';

export const requestGet = (
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, any>,
) => request({ method: 'get', url, params, headers });

export const requestPost = (url: string, data?: any, headers?: Record<string, any>): Promise<any> =>
  request({ method: 'post', url, data, headers });

export const requestPut = (url: string, data?: any, headers?: Record<string, any>): Promise<any> =>
  request({ method: 'put', url, data, headers });

export const requestDelete = (
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, any>,
) => request({ method: 'delete', url, params, headers });
