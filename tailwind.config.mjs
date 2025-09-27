/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
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
  			'arcana-fire': {
  				DEFAULT: '#e25822',
  				dark: '#b02a02'
  			},
  			'arcana-water': {
  				DEFAULT: '#2196f3',
  				dark: '#1565c0'
  			},
  			'arcana-earth': {
  				DEFAULT: '#7c5c36',
  				dark: '#4e342e'
  			},
  			'arcana-air': {
  				DEFAULT: '#b3e5fc',
  				dark: '#0288d1'
  			},
  			'arcana-light': {
  				DEFAULT: '#fffbe6',
  				dark: '#ffe082'
  			},
  			'arcana-dark': {
  				DEFAULT: '#2c1810',
  				dark: '#1a0f08'
  			},
  			'timeline-alpha': {
  				DEFAULT: '#10b981',
  				dark: '#047857'
  			},
  			'timeline-beta': {
  				DEFAULT: '#f59e0b',
  				dark: '#d97706'
  			},
  			'timeline-gamma': {
  				DEFAULT: '#8b5cf6',
  				dark: '#7c3aed'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				dark: '#4f46e5',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				dark: '#475569',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				dark: '#e11d48',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			neutral: {
  				DEFAULT: '#9ca3af',
  				dark: '#6b7280'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			narrative: [
  				'Merriweather',
  				'serif'
  			],
  			ui: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'Fira Mono',
  				'Menlo',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.75rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '3rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '3.5rem'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '4rem'
  				}
  			]
  		},
  		spacing: {
  			'timeline-gutter': '1.5rem',
  			'panel-padding': '2rem',
  			'card-padding': '1rem'
  		},
  		screens: {
  			prose: '65ch',
  			'wide-prose': '80ch'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
} 