import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import Inspect from 'vite-plugin-inspect';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    sveltekit(),
    {
      ...Inspect(),
      apply: 'build'
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
