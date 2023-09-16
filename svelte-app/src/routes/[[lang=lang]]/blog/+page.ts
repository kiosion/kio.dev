import { RECENT_POSTS_COUNT } from '$lib/consts';
import { ENV } from '$lib/env';
import { find } from '$lib/store';

import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent();

  const posts = await find(fetch, 'post', {
    limit: RECENT_POSTS_COUNT,
    lang: params.lang ?? 'en'
  });

  return { posts };
};
