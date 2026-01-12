import client from '@/utils/client';

export interface RequestOptions {
  method: string;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, any>;
}

export async function request({
  method,
  url,
  data = null,
  params = null,
  headers = {},
}: RequestOptions) {
  try {
    const response = await client({
      method,
      url,
      data,
      params,
      headers,
    });

  } catch (err: any) {
    const error = err as any;
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.detail || 'Erreur serveur',
      };
    }

    if (error.request) {
      throw {
        status: null,
        message: 'Serveur injoignable',
      };
    }

    throw {
      status: null,
      message: error.message || String(error),
    };
  }
}
