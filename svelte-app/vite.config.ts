import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import Inspect from 'vite-plugin-inspect';
import StripTestSelectors from 'vite-plugin-test-selectors';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    StripTestSelectors({
      // dev: process.env.VITE_ENV === 'testing'
      dev: true
    }),
    {
      ...Inspect(),
      apply: process.env.VITE_ENV === 'development' ? 'pre' : 'post'
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
