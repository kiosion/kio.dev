import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { findOne } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, url }) => {
  const preview = url.searchParams.get('preview') === 'true' || false,
    opts = { id: params.slug, lang: params.lang || DEFAULT_APP_LANG } as Record<
      string,
      string | boolean
    >;

  preview && (opts.preview = true);

  const post = handleLoadError(await findOne(fetch, 'post', opts));

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
