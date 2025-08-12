import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { HOMEPAGE_POSTS_NUM } from '$lib/consts';

import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch, params }) => {
  const posts = unwrapAPIResponse(
    await find(fetch, 'post', { limit: HOMEPAGE_POSTS_NUM }),
    true
  );
  const config = await parent().then((data) => data.config);

  return { posts: posts ?? [], config };
}) satisfies PageLoad;
