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

    // Ensure dark mode is applied by default
    const applyDarkMode = () => {
      const storedTheme = localStorage.getItem('ea-theme');

      if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Default to dark mode
        document.documentElement.classList.add('dark');
      }

      document.documentElement.classList.add("theme-loaded");
    };

    // Apply dark mode immediately
    applyDarkMode();

    // Also ensure it's applied after theme is resolved
    if (resolvedTheme) {
      const timer = setTimeout(() => {
        if (resolvedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        document.documentElement.classList.add("theme-loaded");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, resolvedTheme]);

  // Ensure the document is marked as theme-loaded on mount
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        document.documentElement.classList.add("theme-loaded");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  return null;
}