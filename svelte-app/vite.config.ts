import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import path from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    StripTestSelectors({
      dev: process.env.MODE !== 'testing'
    }),
    process.env.MODE === 'development' && Inspect()
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
