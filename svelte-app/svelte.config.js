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
      $stores: 'src/stores'
    },
    adapter:
      process.env.SVELTE_ADAPTER_ENV === 'netlify'
        ? NetlifyAdapter()
        : NodeAdapter({ out: './dist' }),
    files: {
      lib: 'src/lib',
      params: 'src/params',
      routes: 'src/routes'
    }
  }
};

export default config;
