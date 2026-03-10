"use client";

import { useTheme } from "next-themes";
import { useThemePreference } from "../lib/ThemePreferenceContext";
import { Settings, Monitor, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const { setTheme, theme } = useTheme();
  const { mode, setMode } = useThemePreference();

  // Derive the radio value: "auto" or the current manual theme ("light" | "dark")
  const currentValue = mode === "auto" ? "auto" : (theme ?? "dark");

  const handleChange = (value: string) => {
    if (value === "auto") {
      setMode("auto");
    } else {
      setMode("manual");
      setTheme(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute top-3 right-3 z-20 cursor-pointer h-8 w-8 flex items-center justify-center rounded-lg border border-border-default bg-popover text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
          aria-label="Account menu"
        >
          <Settings size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentValue} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="auto">
            <Monitor size={14} className="mr-2" />
            Automatic
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun size={14} className="mr-2" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon size={14} className="mr-2" />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
