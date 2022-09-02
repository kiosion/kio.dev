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
  optimizeDeps: {
    include: [
      'highlight.js',
      'highlight.js/lib/core',
      'uifx',
      'seedrandom',
      'moment',
      '@sanity/image-url'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    define: {
      ...viteEnv
    }
  },
  ssr: {
    noExternal: ['devalue']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
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
