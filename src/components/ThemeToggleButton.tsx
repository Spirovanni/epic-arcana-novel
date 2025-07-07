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

  if (!mounted) {
    return (
      <motion.button
        type="button"
        aria-label="Toggle dark mode"
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-50"
        disabled
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="w-5 h-5 block bg-gray-400 rounded-full"></span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="relative px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {theme === "dark" ? (
          <motion.span
            className="text-yellow-400 text-lg"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            ☀️
          </motion.span>
        ) : (
          <motion.span
            className="text-indigo-600 text-lg"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            🌙
          </motion.span>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </motion.div>
    </motion.button>
  );
} 