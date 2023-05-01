import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import svg from '@poppanator/sveltekit-svg';
import viteBabel from 'vite-plugin-babel';

export default defineConfig(({ command, mode }) => {
  const isProduction = ['production', 'staging', 'build'].some(
      (m) => m === mode
    ),
    isTesting = mode === 'testing',
    isDev = ['development', 'backed'].some((m) => m === mode);

  return {
    plugins: [
      svg(),
      sveltekit(),
      StripTestSelectors({
        // confusingly named, 'dev' decides whether to strip or not for build or dev server
        dev: isProduction
      }),
      (isDev || isTesting) && Inspect(),
      // compile to good ol' ES5-compatible code
      (isProduction || isTesting) &&
        command === 'build' &&
        viteBabel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: 'defaults, last 3 versions and not dead and not IE 11'
              }
            ],
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-runtime'
          ]
        })
    ],
    optimizeDeps: {
      include: [
        'fiona',
        'twemoji',
        'svelte-highlight',
        'highlight.js',
        'highlight.js/lib/core',
        'seedrandom',
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
