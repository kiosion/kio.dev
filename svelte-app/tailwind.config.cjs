const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        black: '#0d0c0c',
        white: '#ffffff',
        dark: '#181717',
        light: '#f2f0ed',
        accent: {
          light: '#1e65e1',
          dark: '#affa71'
        },
        orange: {
          light: '#ff4800',
          dark: '#e03400'
        },
        neutral: {
          0: '#f2f0ed',
          100: '#e4e0dc',
          200: '#cfc9c2',
          300: '#b5aca1',
          400: '#595650',
          500: '#383432',
          600: '#2a2726',
          700: '#1e1c1b',
          800: '#181717',
          light: '#e4e0dc',
          dark: '#383432'
        }
      },
      fontFamily: {
        sans: ['TASA Orbiter Deck', ...defaultTheme.fontFamily.sans],
        display: ['TASA Orbiter Display', ...defaultTheme.fontFamily.sans],
        mono: ['Commit Mono', ...defaultTheme.fontFamily.mono]
      },
      fontSize: {
        'xs': ['0.75rem', '1.15'],
        'sm': ['0.9rem', '1.25'],
        'base': ['1rem', '1.5'],
        'md': ['1.125rem', '1.5'],
        'lg': ['1.25rem', '1.5'],
        'xl': ['1.5rem', '1.5'],
        '2xl': ['1.625rem', '1.5'],
        '3xl': ['1.875rem', '1.5'],
        '4xl': ['2.25rem', '1.5'],
        '5xl': ['2.5rem', '1.5']
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.2rem'
      },
      screens: {
        '3xl': '1824px',
        print: { raw: 'print' },
        screen: { raw: 'screen' }
      }
    }
  },
  darkMode: 'class'
};
