import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import path from 'path';
import dotenv from 'dotenv';
import svg from '@poppanator/sveltekit-svg';

dotenv.config();
const viteEnv = {};
Object.keys(process.env).forEach((key) => {
  if (key.startsWith('VITE_')) {
    viteEnv[`import.meta.env.${key}`] = process.env[key];
  }
});

export default defineConfig({
  plugins: [
    svg(),
    sveltekit(),
    StripTestSelectors({
      dev: process.env.MODE !== 'testing'
    }),
    Inspect()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    define: {
      ...viteEnv
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      registerNodeLoader: true
    }
  }
});
