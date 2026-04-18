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
}: RequestOptions): Promise<any> {
  try {
    const response = await client({ method, url, data, params, headers });
    return response.data;
  } catch (err: any) {
    // Extract error message from response if available
    // const errorMessage =
    //   err?.response?.data?.message ||
    //   err?.message ||
    //   'Une erreur est survenue lors de la requête';
    // throw new Error(errorMessage);
  }
}
