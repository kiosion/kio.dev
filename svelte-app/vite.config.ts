/* eslint-disable prettier/prettier */
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';

export default defineConfig(({ mode }: ConfigEnv) => {
  const isTesting = mode === 'testing',
    isDev = mode === 'development';

  return {
    plugins: [
      tailwindcss(),
      sveltekit(),
      (isDev || isTesting) && Inspect()
    ],
    resolve: {
      alias: [
        {
          find: /^@styles\/(.*)$/,
          replacement: resolve(__dirname, 'src/styles/$1.scss')
        }
      ]
    },
    optimizeDeps: {
      include: [
        'svelte-highlight',
        'highlight.js',
        'highlight.js/lib/core',
        '@sanity/image-url'
      ]
    },
    test: {
      include: ['tests/unit/**.test.ts'],
      globals: true,
      environment: 'jsdom'
    },
    build: {
      rollupOptions: {
        output: {
          compact: true,
          generatedCode: {
            constBindings: true,
            objectShorthand: true
          },
          inlineDynamicImports: false
        }
      }
    },
    ssr: {
      noExternal: ['@portabletext/toolkit']
    },
    appType: 'custom' as const
  };
});
