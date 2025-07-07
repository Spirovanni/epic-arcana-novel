"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle dark mode"
        className="fixed top-4 right-4 z-50 px-3 py-1 rounded bg-gray-200"
        disabled
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-md hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
} 