import { unwrap } from '$lib/api/result';
import { find } from '$lib/api/store';
import { DEFAULT_APP_LANG, DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';

import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  // TODO: Once tags are refactored should actually fetch here instead of reducing posts to tags.
  const posts = unwrap(
    await find(fetch, 'post', {
      ...DEFAULT_POST_QUERY_PARAMS,
      lang: params.lang || DEFAULT_APP_LANG
    })
  );
  return { posts };
}) satisfies LayoutLoad;
