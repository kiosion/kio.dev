import NodeAdapter from '@sveltejs/adapter-node';
import NetlifyAdapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true
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
        ? NetlifyAdapter()
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

// export default config;
