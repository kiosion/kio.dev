import { RECENT_POSTS_COUNT } from '$lib/consts';
import { find } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const posts = await find(fetch, 'post', {
    limit: RECENT_POSTS_COUNT,
    lang: params.lang ?? 'en'
  });

  return { posts };
}) satisfies PageLoad;
