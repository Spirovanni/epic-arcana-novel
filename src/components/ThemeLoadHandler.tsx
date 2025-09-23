"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeLoadHandler() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Mark the theme as loaded to enable transitions
    const handleThemeLoad = () => {
      document.documentElement.classList.add("theme-loaded");
    };

    // Wait for theme to be resolved and applied
    if (resolvedTheme) {
      const timer = setTimeout(handleThemeLoad, 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, resolvedTheme]);

  // Ensure the document is marked as theme-loaded on mount
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        document.documentElement.classList.add("theme-loaded");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  return null;
}