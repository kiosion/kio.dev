import NodeAdapter from '@sveltejs/adapter-node';
import NetlifyAdapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: true
  }),
  kit: {
    alias: {
      $components: 'src/components',
      $helpers: 'src/lib/helpers',
      $stores: 'src/stores',
      $langs: 'src/languages',
      $i18n: 'src/lib/helpers/i18n'
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
      enabled: true,
      crawl: true,
      entries: ['*'],
      onError: ({ status, path }) => {
        if (status === 404) {
          if (path.startsWith('/en') || path.startsWith('/fr')) {
            return;
          }
        }
      }
    },
    trailingSlash: 'ignore'
  }
};

export default config;
