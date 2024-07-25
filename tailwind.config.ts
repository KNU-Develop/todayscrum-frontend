import type { Config } from 'tailwindcss'
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
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
        pretendard: ['Pretendard', 'sans-serif'],
      },
      boxShadow: {
        base: '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.10)',
      },
      fontSize: {
        h1: [
          '3rem',
          {
            lineHeight: '3rem',
            letterSpacing: '-0.012em',
            fontWeight: '800',
          },
        ],
        h2: [
          '1.875rem',
          {
            lineHeight: '2.25rem',
            letterSpacing: '-0.0075em',
            fontWeight: '600',
          },
        ],
        h3: [
          '1.5rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.006em',
            fontWeight: '600',
          },
        ],
        h4: [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '-0.005em',
            fontWeight: '600',
          },
        ],
        large: [
          '1.125rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0em',
            fontWeight: '600',
          },
        ],
        lead: [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        p: [
          '1rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        'p-ui': [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        body: [
          '0.875rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        subtle: [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
        small: [
          '0.875rem',
          {
            lineHeight: '0.875rem',
            letterSpacing: '0em',
            fontWeight: '500',
          },
        ],
        detail: [
          '0.75rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0em',
            fontWeight: '500',
          },
        ],
        blockquote: [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0em',
            fontWeight: '300',
          },
        ],
        'inline-code': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0em',
            fontWeight: '700',
          },
        ],
        'table-head': [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0em',
            fontWeight: '700',
          },
        ],
        'table-item': [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0em',
            fontWeight: '400',
          },
        ],
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'appear-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'disappear-bottom': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s forwards',
        'fade-out': 'fade-out 0.5s forwards',
        'appear-up': 'appear-up 0.5s forwards',
        'disappear-bottom': 'disappear-bottom 0.5s forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
