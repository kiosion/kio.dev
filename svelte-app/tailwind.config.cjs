const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['Work Sans', ...defaultTheme.fontFamily.mono],
        code: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
        display: ['Hauora Sans', 'Poppins', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        'xs': ['0.75rem', '1'],
        '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['2.25rem', '1'],
        '6xl': ['3rem', '1'],
        '7xl': ['3.825rem', '1'],
        '8xl': ['4.5rem', '1']
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
