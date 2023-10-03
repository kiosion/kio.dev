import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { findOne } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, url }) => {
  const lang = params.lang || DEFAULT_APP_LANG,
    preview = url.searchParams.get('preview') === 'true' || false,
    post = handleLoadError(
      await findOne(fetch, 'post', { idb: btoa(params.slug), lang, preview })
    );

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
