import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 🔥 THEME UPGRADE: Using the soft warm white for the background
        background: 'oklch(0.98 0.002 75)', 
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: '#ffffff', // Pure white cards to pop against the warm background
          foreground: 'hsl(var(--card-foreground))',
        },
        // ... (keeping your other colors the same)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        // 🔥 THEME UPGRADE: Standardizing the high-end rounding
        '3xl': '24px',
        '2xl': '20px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // 🔥 THEME UPGRADE: The "Human-Designed" Triple Layer Shadow
        'premium': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03), 0 16px 40px rgba(0,0,0,0.02)',
        'premium-hover': '0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.05), 0 24px 56px rgba(0,0,0,0.04)',
        'flagged': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(220,50,40,0.06), 0 16px 40px rgba(220,50,40,0.04)',
        'flagged-hover': '0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(220,50,40,0.08), 0 24px 56px rgba(220,50,40,0.06)',
      },
      // ... (rest of your config)
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config