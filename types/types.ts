import { ROLE } from '@/constant/role';

export interface User {
  email?: string;
  username?: string;
  password?: string;
  role?: ROLE;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
}

export interface Event {
  id: number;
  name: string;
  location: string;
  price: number;
  link?: string;
  description?: string;
  event_type?: EventType;
  note?: number;
  capacity?: number;
}

export interface Profile {
    id: number;
    name: string;
    description?: string;
    image?: string;
    event_type?: EventType;
}

export interface EventType {
  name: string;
}
