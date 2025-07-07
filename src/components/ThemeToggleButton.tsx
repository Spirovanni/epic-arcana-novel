"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-50">
        <span>🌙</span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {theme === "dark" ? "☀️" : "🌙"}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </div>
    </motion.button>
  );
} 