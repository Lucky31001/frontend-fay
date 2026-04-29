import { request } from './request';

export const requestGet = (
  url: string,
  params?: any,
  headers?: Record<string, any>,
) => request({ method: 'get', url, params, headers });

export const requestPost = (
  url: string,
  data?: any,
  headers?: Record<string, any>,
): Promise<any> => {
  const hdrs: Record<string, any> = { ...(headers || {}) };
  // If data is FormData, do not set Content-Type so the client can set the proper multipart boundary
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  if (!isForm && !hdrs['Content-Type'] && !hdrs['content-type']) {
    hdrs['Content-Type'] = 'application/json';
  }
  return request({ method: 'post', url, data, headers: hdrs });
};

export const requestPut = (
  url: string,
  data?: any,
  headers?: Record<string, any>,
): Promise<any> => {
  const hdrs: Record<string, any> = { ...(headers || {}) };
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  if (!isForm && !hdrs['Content-Type'] && !hdrs['content-type']) {
    hdrs['Content-Type'] = 'application/json';
  }
  return request({ method: 'put', url, data, headers: hdrs });
};

export const requestDelete = (
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, any>,
) => request({ method: 'delete', url, params, headers });
