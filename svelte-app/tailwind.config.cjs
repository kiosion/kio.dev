const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        black: '#171C22',
        white: '#F5F5F5',
        dark: '#182542',
        light: '#EFEFEF',
        accent: {
          light: '#235bd3',
          dark: '#d1fe7d'
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
