const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        black: '#171c22',
        white: '#f5f5f5',
        dark: '#242b33',
        light: '#f2f2f2',
        accent: {
          light: '#1e65e1',
          dark: '#affa71'
        }
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['Work Sans', ...defaultTheme.fontFamily.mono],
        code: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono]
      },
      fontSize: {
        'xs': ['0.75rem', '1'],
        '4xl': ['2.25rem', '1.15'],
        '5xl': ['2.25rem', '1.15'],
        '6xl': ['3rem', '1.15']
      },
      borderRadius: {
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
