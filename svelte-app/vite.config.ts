import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import dotenv from 'dotenv';
import svg from '@poppanator/sveltekit-svg';

dotenv.config();
const viteEnv = {} as Record<string, string>;
Object.keys(process.env).forEach((key) => {
  if (key.startsWith('VITE_')) {
    viteEnv[`import.meta.env.${key}`] = process.env[key] as string;
  }
});

export default defineConfig({
  plugins: [
    // @ts-expect-error - svg plugin is not typed properly
    svg(),
    sveltekit(),
    StripTestSelectors({
      dev: process.env.MODE !== 'testing'
    }),
    process.env.MODE === 'testing' && Inspect()
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
    // @ts-expect-error - Need to update this
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
