/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arcana Types
        'arcana-fire': {
          DEFAULT: '#e25822', // vivid orange-red
          dark: '#b02a02',
        },
        'arcana-water': {
          DEFAULT: '#2196f3', // blue
          dark: '#1565c0',
        },
        'arcana-earth': {
          DEFAULT: '#7c5c36', // brown
          dark: '#4e342e',
        },
        'arcana-air': {
          DEFAULT: '#b3e5fc', // light blue
          dark: '#0288d1',
        },
        'arcana-light': {
          DEFAULT: '#fffbe6', // pale yellow
          dark: '#ffe082',
        },
        'arcana-dark': {
          DEFAULT: '#2c1810', // deep brown
          dark: '#1a0f08',
        },
        // Timeline Branches
        'timeline-alpha': {
          DEFAULT: '#10b981', // emerald
          dark: '#047857',
        },
        'timeline-beta': {
          DEFAULT: '#f59e0b', // amber
          dark: '#d97706',
        },
        'timeline-gamma': {
          DEFAULT: '#8b5cf6', // violet
          dark: '#7c3aed',
        },
        // Semantic UI Colors
        'primary': {
          DEFAULT: '#6366f1', // indigo
          dark: '#4f46e5',
        },
        'secondary': {
          DEFAULT: '#64748b', // slate
          dark: '#475569',
        },
        'accent': {
          DEFAULT: '#f43f5e', // rose
          dark: '#e11d48',
        },
        'neutral': {
          DEFAULT: '#9ca3af', // gray
          dark: '#6b7280',
        },
      },
      fontFamily: {
        narrative: ["Merriweather", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Mono", "Menlo", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.25rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "2rem" }],
        xl: ["1.25rem", { lineHeight: "2.25rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.75rem" }],
        "4xl": ["2.25rem", { lineHeight: "3rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
      },
      spacing: {
        'timeline-gutter': '1.5rem',
        'panel-padding': '2rem',
        'card-padding': '1rem',
      },
      screens: {
        'prose': '65ch',
        'wide-prose': '80ch',
      },
    },
  },
  plugins: [],
} 