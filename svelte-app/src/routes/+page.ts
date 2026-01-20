import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { HOMEPAGE_POSTS_NUM } from '$lib/consts';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();

  return { posts: parentData.posts, config: parentData.config };
}) satisfies PageLoad;
