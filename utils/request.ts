import client from '@/utils/client';

export interface RequestOptions {
  method: string;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, any>;
}

export async function request({ method, url, data = null, params = null, headers = {} }: RequestOptions): Promise<any> {
  try {
    const response = await client({ method, url, data, params, headers });
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.detail ?? err?.response?.data ?? err?.message ?? 'Erreur réseau';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}
