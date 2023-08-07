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
          // TOOD: Fix manual chunking
          manualChunks: (id: string) => {
            // check for svelte-highlight / highlight.js and portabletext,
            // chunk into their own dirs
            switch (true) {
              case id.includes('svelte-highlight/styles'):
                return 'svelte-highlight/styles';
              case id.includes('highlight.js/lib/core'):
                return 'highlight.js/core';
              case id.includes('@portabletext'):
                return 'portabletext';
            }
            // check for hljs langs, chunk into dirs based on first letter
            // to reduce size of chunks
            const matchHlLang = id.match(
                /highlight\.js(?:\/lib){0,1}\/languages\/([a-zA-Z])+/
              ),
              matchSHlLang = id.match(
                /svelte-highlight(?:\/lib){0,1}\/languages\/([a-zA-Z])+/
              );
            if (matchHlLang) {
              return `highlight.js/languages/${matchHlLang[1]}`;
            } else if (matchSHlLang) {
              return `svelte-highlight/languages/${matchSHlLang[1]}`;
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
