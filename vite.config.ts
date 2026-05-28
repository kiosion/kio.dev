import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import type { ConfigEnv } from 'vite';
import { defineConfig } from 'vite';

// eslint-disable-next-line no-restricted-imports
import postsManifest from './scripts/posts-manifest-plugin';

export default defineConfig(({ mode }: ConfigEnv) => ({
  plugins: [tailwindcss(), postsManifest({ postsDir: 'src/content/posts' }), sveltekit()],
  resolve: {
    alias: [
      {
        find: /^@styles\/(.*)$/,
        replacement: resolve(__dirname, 'src/styles/$1.scss'),
      },
    ],
  },
  test: {
    include: ['tests/unit/**.test.ts'],
    globals: true,
    environment: 'jsdom',
  },
  build: {
    rollupOptions: {
      output: {
        compact: true,
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
        },
        inlineDynamicImports: false,
      },
    },
  },
  ssr: {
    noExternal: ['@portabletext/toolkit'],
  },
  appType: 'custom' as const,
}));
