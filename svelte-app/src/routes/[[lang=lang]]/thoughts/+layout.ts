import { DEFAULT_APP_LANG, DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { find } from '$lib/store';

import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const posts = handleLoadError(
    await find(fetch, 'post', {
      ...DEFAULT_POST_QUERY_PARAMS,
      lang: params.lang || DEFAULT_APP_LANG
    })
  );

  return { posts };
}) satisfies LayoutLoad;
