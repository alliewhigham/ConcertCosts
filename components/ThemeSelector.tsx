"use client";

import { Palette } from "lucide-react";
import { THEMES, useTheme, type ThemeName } from "./ThemeProvider";

type ThemeSelectorProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeSelector({ className = "", compact = false }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      {!compact && (
        <span className="flex items-center gap-1 text-sm opacity-80">
          <Palette className="h-4 w-4" aria-hidden />
          Theme
        </span>
      )}
      <select
        className="select select-bordered select-sm w-full max-w-[10.5rem]"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        aria-label="Choose theme"
      >
        {THEMES.map((name) => (
          <option key={name} value={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}
