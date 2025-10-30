import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
        decentracode: ['"DECENTRACODE"', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.01em',
        tighter: '-0.03em',
        wide: '0.03em',
        'extra-wide': '0.05em', 
      },
      fontWeight: {
        'extra-bold': '900', 
      },
      lineHeight: {
        '12': '1.2',
        '16': '1.6',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'primary-black': '#111111', // Keeping for existing usage, but new components use direct hex
        'off-white': '#F9FAFB', // Updated to match design system background
        'gray-subtext': '#6B7280', // Updated to match design system secondary text
        'accent-neon-green': '#16FF6E', // Updated to match design system accent color
        'red-neon': '#FF1744', // Keeping for existing usage
        'orange-neon': '#FF9100', // Keeping for existing usage
        'line-green-gradient': 'linear-gradient(90deg, #16FF6E, #00E676)', // Updated to match new accent
        // Design System Colors
        'ds-background': '#F9FAFB',
        'ds-text-primary': '#111111',
        'ds-text-secondary': '#6B7280',
        'ds-accent': '#16FF6E',
        'ds-borders': '#E5E7EB',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem', // Custom border radius
        '2xl': '1.5rem', // Custom border radius
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'ds-soft': '0_2px_12px_rgba(0,0,0,0.05)', // Custom shadow from design system
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'hover-brightness': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.04)' },
        },
        'border-glow': {
          '0%, 100%': { 'box-shadow': '0 0 0px rgba(0, 112, 243, 0)' },
          '50%': { 'box-shadow': '0 0 15px rgba(0, 112, 243, 0.6)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'hover-brightness': 'hover-brightness 0.3s ease-in-out forwards',
        'border-glow': 'border-glow 1.5s infinite alternate',
      },
      transitionTimingFunction: {
        'cubic-bezier': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
