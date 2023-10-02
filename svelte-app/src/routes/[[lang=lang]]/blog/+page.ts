import { DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';
import { find } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const posts = await find(fetch, 'post', {
    ...DEFAULT_POST_QUERY_PARAMS,
    lang: params.lang ?? 'en'
  });

  return { posts };
}) satisfies PageLoad;
