// Light/dark theme. index.html sets data-theme on <html> before the first
// paint (saved choice, else the system setting); this hook reads and toggles it.
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'wjc-theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#0a0f1e', light: '#f5f7fc' };

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

/** 'dark' during prerender and the first client render, then the real theme. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => setTheme(currentTheme()), []);
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // not persisted in private mode
    }
  }, []);
  return [theme, toggle];
}
