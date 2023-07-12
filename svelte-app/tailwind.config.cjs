const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        black: '#000b00',
        white: '#f3f3f2',
        dark: '#16160e',
        light: '#e5e4e6',
        gray: '#2b2b2b',
        accent: {
          light: '#6c848d',
          dark: '#b7dbcc'
        }
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['Work Sans', ...defaultTheme.fontFamily.mono],
        code: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
        display: ['Roboto', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        'xs': ['0.75rem', '1'],
        '4xl': ['2.25rem', '1.15'],
        '5xl': ['2.25rem', '1.15'],
        '6xl': ['3rem', '1.15'],
        '7xl': ['3.5rem', '1.15'],
        '8xl': ['4.5rem', '1.15']
      },
      borderRadius: {
        sm: '0.2rem'
      },
      keyframes: {
        wave: {
          to: {
            'margin-left': '-51%'
          }
        }
      },
      background: {
        'radial-light': 'radial-gradient(#e2e8f0, transparent 25%)',
        'radial-dark': 'radial-gradient(#0f172a, transparent 25%)'
      },
      animation: {
        wave: 'wave 1.5s linear infinite'
      },
      screens: {
        '3xl': '1824px'
      }
    }
  },
  darkMode: 'class'
};
