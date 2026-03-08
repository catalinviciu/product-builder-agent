"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

function getTimeTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 9 && hour < 18 ? "light" : "dark";
}

export function TimeBasedTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(getTimeTheme());
    const interval = setInterval(() => setTheme(getTimeTheme()), 60_000);
    return () => clearInterval(interval);
  }, [setTheme]);

  return null;
}
