import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '@/utils/storage';

type AuthContextType = {
  token: string | null;
  loading: boolean;
  signIn: (token: string, refresh?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const isJwtExpired = (token: string | null, marginSeconds = 60): boolean => {
  if (!token) return true;

  const decoded = decodeJwtPayload(token);
  if (!decoded?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now + marginSeconds;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const t = await storage.getItem('access_token');
        if (t && !isJwtExpired(t)) {
          setToken(t);
          setIsAuthenticated(true);
          router.push('/(tabs)/home');
        } else {
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (t: string, refresh?: string) => {
    await storage.setItem('access_token', t);
    if (refresh) await storage.setItem('refresh_token', refresh);
    setToken(t);
    setIsAuthenticated(true);
    console.log('Signed in, token set');
  };

  const signOut = async () => {
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(!!token && !isJwtExpired(token));
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
