import { api, unwrapSafe } from '$lib/api/client';
import { HOMEPAGE_POSTS_NUM } from '$lib/consts';

import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch, params }) => {
  const posts = unwrapSafe(
    await api.getPosts(fetch, { lang: params.lang, limit: HOMEPAGE_POSTS_NUM })
  );
  const config = await parent().then((data) => data.config);

  return { posts: posts ?? [], config };
}) satisfies PageLoad;
