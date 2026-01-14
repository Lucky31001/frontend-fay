export interface User {
  id: number | string;
  email: string;
  username?: string;
  role?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  access_token?: string;
  refresh_token?: string;
  message?: string;
  errors?: Record<string, any> | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  role?: string;
  [key: string]: any;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token?: string;
  role?: string;
  [key: string]: any;
}


export interface APIEvent {
  id: number;
  name: string;
  location: string;
  price: number;
  link?: string;
  description?: string;
  event_type?: string;
  note?: number;
  capacity?: number;
}