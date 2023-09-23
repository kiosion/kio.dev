import { RECENT_POSTS_COUNT } from '$lib/consts';
import { find } from '$lib/store';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const _parentData = await parent(),
    posts = await find(fetch, 'post', {
      limit: RECENT_POSTS_COUNT,
      lang: params.lang ?? 'en'
    });

  return { posts };
};
