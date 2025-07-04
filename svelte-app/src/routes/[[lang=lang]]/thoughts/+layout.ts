import { api, unwrapSafe } from '$lib/api/client';
import { DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';

import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const posts = unwrapSafe(
    await api.getPosts(fetch, { ...DEFAULT_POST_QUERY_PARAMS, lang: params.lang })
  );

  return { posts };
}) satisfies LayoutLoad;
