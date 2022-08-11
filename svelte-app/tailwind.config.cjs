const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.svelte'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['"Work Sans"', ...defaultTheme.fontFamily.mono],
        code: ['"Ubuntu Mono"', ...defaultTheme.fontFamily.mono],
        display: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        wave: {
          to: {
            'margin-left': '-51%'
          }
        }
      },
      animation: {
        wave: 'wave 1.5s linear infinite'
      }
    }
  },
  darkMode: 'class',
  plugins: []
};
