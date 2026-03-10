"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ThemeMode = "auto" | "manual";

interface ThemePreferenceContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  mode: "auto",
  setMode: () => {},
});

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("auto");

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme-mode");
    if (stored === "auto" || stored === "manual") {
      setModeState(stored);
    }
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  return (
    <ThemePreferenceContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  return useContext(ThemePreferenceContext);
}
