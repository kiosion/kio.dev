import NodeAdapter from '@sveltejs/adapter-node';
import NetlifyAdapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter:
      process.env.SVELTE_ADAPTER_ENV === 'development'
        ? NodeAdapter({ out: './dist' })
        : NetlifyAdapter()
  }
};

export default config;
