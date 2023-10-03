import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import StripTestSelectors from 'vite-plugin-test-selectors';

export default defineConfig(({ command, mode }) => {
  const isProduction = ['production', 'staging', 'build'].some((m) => m === mode),
    isTesting = mode === 'testing',
    isDev = ['development', 'backed'].some((m) => m === mode);

  return {
    plugins: [
      svg(),
      sveltekit(),
      StripTestSelectors({
        dev: isProduction
      }),
      (isDev || isTesting) && Inspect()
    ],
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
      globals: true,
      environment: 'jsdom',
      deps: {
        registerNodeLoader: true
      }
    },
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: false,
          manualChunks: (id: string) => {
            // check for svelte-highlight / highlight.js and portabletext,
            // chunk into their own dirs
            switch (true) {
              case id.includes('svelte-highlight'):
                return 'svelte-highlight';
              case id.includes('highlight.js'):
                return 'hljs';
            }
          }
        }
      }
    },
    ssr: {
      noExternal: ['@portabletext/toolkit']
    },
    appType: 'custom'
  };
});
