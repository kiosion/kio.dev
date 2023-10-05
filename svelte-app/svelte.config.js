import NetlifyAdapter from '@sveltejs/adapter-netlify';
import NodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
export default {
  compilerOptions: {
    cssHash: ({ hash, css }) => `sc-${hash(css)}`,
    discloseVersion: false
  },
  preprocess: [
    vitePreprocess({
      script: true,
      style: {
        resolve: {
          alias: [
            {
              find: /^@styles\/(.*)$/,
              replacement: path.resolve(__dirname, 'src/styles/_$1.scss')
            }
          ]
        }
      }
    })
  ],
  kit: {
    alias: {
      $components: 'src/components',
      $helpers: 'src/lib/helpers',
      $stores: 'src/stores',
      $langs: 'src/languages',
      $i18n: 'src/lib/helpers/i18n',
      $routes: 'src/routes'
    },
    adapter:
      process.env.SVELTE_ADAPTER_ENV === 'netlify'
        ? NetlifyAdapter({
            edge: false,
            split: false
          })
        : NodeAdapter({ out: './dist' }),
    files: {
      lib: 'src/lib',
      params: 'src/params',
      routes: 'src/routes'
    },
    prerender: {
      crawl: true,
      entries: ['*'],
      handleHttpError: ({ status, path }) => {
        if (status === 404) {
          if (path.startsWith('/en') || path.startsWith('/fr')) {
            return;
          }
        }
      }
    }
  }
};
