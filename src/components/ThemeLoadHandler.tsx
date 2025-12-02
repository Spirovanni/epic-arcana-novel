"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useTheme } from "next-themes";

type ThemeLoadHandlerProps = {
  storageKey?: string;
};

export function ThemeLoadHandler({ storageKey = "ea-theme" }: ThemeLoadHandlerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  const applyThemeClass = (mode: "light" | "dark") => {
    const html = document.documentElement;
    html.classList.toggle("dark", mode === "dark");
    html.dataset.theme = mode;
  };

  useIsoLayoutEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "light" || stored === "dark"
      ? stored
      : systemPrefersDark
        ? "dark"
        : "light";

    applyThemeClass(initial);
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    applyThemeClass(resolvedTheme === "dark" ? "dark" : "light");
    document.documentElement.classList.add("theme-loaded");
  }, [mounted, resolvedTheme]);

  return null;
}
