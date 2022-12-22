import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production' || mode === 'staging',
    isTesting = mode === 'testing',
    isDev = mode === 'development' || mode === 'backed';

  console.log('isProduction', isProduction);
  console.log('isTesting', isTesting);
  console.log('isDev', isDev);

  return {
    plugins: [
      svg(),
      sveltekit(),
      StripTestSelectors({
        // Confusingly named, 'dev' decides whether to strip or not
        dev: !!isProduction
      }),
      (isDev || isTesting) && Inspect()
    ],
    optimizeDeps: {
      include: [
        'highlight.js',
        'highlight.js/lib/core',
        'svelte-highlight',
        'seedrandom',
        'moment',
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
          manualChunks: undefined
        }
      }
    },
    appType: 'custom'
  };
});
