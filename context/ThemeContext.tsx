import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { storage } from '@/utils/storage';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

type ThemeContextType = {
  isDark: boolean;
  toggle: () => Promise<void>;
  paperTheme: any;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: async () => {},
  paperTheme: MD3LightTheme,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await storage.getItem('dark_mode');
        setIsDark(v === 'true');
      } catch {}
    })();
  }, []);

  const toggle = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await storage.setItem('dark_mode', next ? 'true' : 'false');
    } catch {}
  };

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, paperTheme }}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
