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
      }
    }
  },
  darkMode: 'class',
  plugins: []
};
