import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import StripTestSelectors from 'vite-plugin-test-selectors';
import Inspect from 'vite-plugin-inspect';
import svg from '@poppanator/sveltekit-svg';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production' || mode === 'staging',
    isTesting = mode === 'testing',
    isDev = mode === 'development' || mode === 'backed';

  return {
    plugins: [
      svg(),
      sveltekit(),
      StripTestSelectors({
        // confusingly named, 'dev' decides whether to strip or not
        dev: !!isProduction
      }),
      (isDev || isTesting) && Inspect(),
      // compile to good ES5-compatible code
      commonjs(),
      babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        runtimeHelpers: true,
        exclude: ['node_modules/@babel/**'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: '> 0.5%, not dead, not ie 11',
              useBuiltIns: 'entry'
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
