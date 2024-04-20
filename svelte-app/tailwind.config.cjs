const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        black: '#17181a',
        white: '#f5f5f5',
        dark: '#292c30',
        light: '#f2f2f2',
        accent: {
          light: '#1e65e1',
          dark: '#affa71'
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
