/* eslint-disable quote-props, prettier/prettier */
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import StripTestSelectors from 'vite-plugin-test-selectors';

import type { ConfigEnv } from 'vite';

export default defineConfig(({ mode }: ConfigEnv) => {
  const isTesting = mode === 'testing',
    isDev = mode === 'development';

  return {
    plugins: [
      sveltekit(),
      StripTestSelectors({
        dev: !isTesting
      }),
      (isDev || isTesting) && Inspect()
    ],
    resolve: {
      alias: [
        {
          find: /^@styles\/(.*)$/,
          replacement: resolve(__dirname, 'src/styles/_$1.scss')
        }
      ]
    },
    optimizeDeps: {
      include: [
        'twemoji',
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
