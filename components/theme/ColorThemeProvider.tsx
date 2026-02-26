"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ColorTheme = "classic" | "pastel" | "neon" | "rosegold";

const COLOR_THEMES: ColorTheme[] = ["classic", "pastel", "neon", "rosegold"];

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue>({
  colorTheme: "classic",
  setColorTheme: () => {},
});

export function useColorTheme() {
  return useContext(ColorThemeContext);
}

const STORAGE_KEY = "color-theme";

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("classic");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorTheme | null;
    if (stored && COLOR_THEMES.includes(stored)) {
      setColorThemeState(stored);
    }
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    const html = document.documentElement;
    if (theme === "classic") {
      html.removeAttribute("data-color-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      html.setAttribute("data-color-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, []);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}
