"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useThemePreference } from "../lib/ThemePreferenceContext";

function getTimeTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 9 && hour < 18 ? "light" : "dark";
}

export function TimeBasedTheme() {
  const { setTheme } = useTheme();
  const { mode } = useThemePreference();

  useEffect(() => {
    if (mode === "manual") return;
    setTheme(getTimeTheme());
    const interval = setInterval(() => setTheme(getTimeTheme()), 60_000);
    return () => clearInterval(interval);
  }, [setTheme, mode]);

  return null;
}
