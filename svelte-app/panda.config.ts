import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{html,js,ts,svelte}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          darker: { value: '#171c22' },
          dark: { value: '#242b33' },
          lighter: { value: '#f5f5f5' },
          light: { value: '#efefef' },
          accentdark: { value: '#3b75f5' },
          accentlight: { value: '#affa71' }
        }
      },
      semanticTokens: {
        colors: {
          primary: {
            value: { base: '{colors.darker}', _dark: '{colors.lighter}' }
          },
          secondary: {
            value: { base: '{colors.dark}', _dark: '{colors.light}' }
          },
          accent: {
            value: { base: '{colors.accentlight}', _dark: '{colors.accentdark}' }
          }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
});
