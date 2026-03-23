"use client"

import React from "react";

type Theme = "light" | "dark";
type ThemeMode = "system" | Theme;

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const savedMode = window.localStorage.getItem("appgpp-theme-mode");
  if (savedMode === "system" || savedMode === "light" || savedMode === "dark") return savedMode;

  // compatibilidade com chave antiga
  const legacyTheme = window.localStorage.getItem("appgpp-theme");
  if (legacyTheme === "light" || legacyTheme === "dark") return legacyTheme;
  return "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mode, setModeState] = React.useState<ThemeMode>("system");

  React.useEffect(() => {
    const initialMode = getInitialMode();
    const initialTheme = initialMode === "system" ? getSystemTheme() : initialMode;
    setModeState(initialMode);
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const setMode = React.useCallback((nextMode: ThemeMode) => {
    const nextTheme = nextMode === "system" ? getSystemTheme() : nextMode;
    window.localStorage.setItem("appgpp-theme-mode", nextMode);
    // limpa chave legada
    window.localStorage.removeItem("appgpp-theme");
    setModeState(nextMode);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode !== "system") return;
      const nextTheme = getSystemTheme();
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const value = React.useMemo(() => ({ theme, mode, setMode }), [theme, mode, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
