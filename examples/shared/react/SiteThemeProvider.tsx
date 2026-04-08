'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SiteTheme = 'dark' | 'light';

const themeStorageKey = 'immersive-scroll-theme';

interface SiteThemeContextValue {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

function resolveInitialTheme(): SiteTheme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function SiteThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<SiteTheme>('dark');

  useEffect(() => {
    const nextTheme = resolveInitialTheme();
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const value = useMemo<SiteThemeContextValue>(
    () => ({
      theme,
      setTheme(nextTheme) {
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(themeStorageKey, nextTheme);
      },
      toggleTheme() {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        window.localStorage.setItem(themeStorageKey, nextTheme);
      }
    }),
    [theme]
  );

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);

  if (!context) {
    throw new Error('useSiteTheme must be used within SiteThemeProvider.');
  }

  return context;
}
