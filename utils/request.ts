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
    const config: any = { method, url, headers };

    if (data !== undefined) config.data = data;
    if (params !== undefined) config.params = params;

    const response = await client(config);
    return response.data;
  } catch (err: any) {
    console.log('Request error:', err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Une erreur est survenue lors de la requête';
    try {
      const toastModule = await import('react-native-toast-message');
      const Toast = toastModule && (toastModule.default || toastModule);
      Toast.show({
        type: 'error',
        text1: errorMessage,
      });
    } catch {
      // ignore if toast cannot be shown
    }
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
}
