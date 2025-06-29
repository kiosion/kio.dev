import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { DEFAULT_APP_LANG, DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';

import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const posts = unwrapAPIResponse(
    await find(fetch, 'post', {
      ...DEFAULT_POST_QUERY_PARAMS,
      lang: params.lang || DEFAULT_APP_LANG
    })
  );
  return { posts };
}) satisfies LayoutLoad;
