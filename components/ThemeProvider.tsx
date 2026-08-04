"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const THEMES = [
  "synthwave",
  "cyberpunk",
  "night",
  "dracula",
  "luxury",
  "dark",
  "light",
  "cupcake",
  "valentine",
  "aqua",
] as const;

export type ThemeName = (typeof THEMES)[number];

const DEFAULT_THEME: ThemeName = "synthwave";
const STORAGE_KEY = "concert-cost-theme";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    const initial = saved && THEMES.includes(saved) ? saved : DEFAULT_THEME;
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-base-300" data-theme={DEFAULT_THEME} />
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
