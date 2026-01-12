import React, { createContext, useEffect, useState, ReactNode } from 'react';
import {storage} from "@/utils/storage";

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
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  try {
    const decoded = decodeJwtPayload(token);
    if (!decoded || !decoded.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err) {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await storage.getItem('access_token');
        if (t && !isJwtExpired(t)) {
          setToken(t);
        } else {
          setToken(null);
        }
      } catch (err) {
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (t: string, refresh?: string) => {
    storage.setItem('access_token', t);
    if (refresh) storage.setItem('refresh_token', refresh);
    setToken(t);
  };

  const signOut = async () => {
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
    setToken(null);
  };

  const isAuthenticated = !!token && !isJwtExpired(token);

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
