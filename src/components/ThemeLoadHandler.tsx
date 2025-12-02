"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeLoadHandler() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Immediately apply dark mode before hydration
  useEffect(() => {
    const html = document.documentElement;
    const storedTheme = localStorage.getItem('ea-theme');

    // Apply dark mode by default, respect user's preference if stored
    if (storedTheme === 'light') {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;

    // Apply theme based on resolved theme from next-themes
    if (resolvedTheme === 'light') {
      html.classList.remove('dark');
    } else if (resolvedTheme === 'dark') {
      html.classList.add('dark');
    }

    // Mark theme as loaded to enable transitions
    html.classList.add("theme-loaded");
  }, [mounted, resolvedTheme]);

  return null;
}