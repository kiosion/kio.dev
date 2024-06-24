import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { findOne, incViews } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch, params, url }) => {
  const _parent = await parent(),
    preview = url.searchParams.get('preview') === 'true' || false,
    opts = { id: params.slug, lang: params.lang || DEFAULT_APP_LANG } as Record<
      string,
      string | boolean
    >;

  preview && (opts.preview = true);

  const post =
    // in some cases _parent isn't defined during SSR...?
    (!preview && _parent?.posts?.find?.((post) => post.slug?.current === params.slug)) ||
    handleLoadError(await findOne(fetch, 'post', opts));

  post && incViews(fetch, post);

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
