import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { findOne } from '$lib/store';

import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch, params, url }) => {
  const _parent = await parent(),
    preview = url.searchParams.get('preview') === 'true' || false,
    opts = { id: params.slug, lang: params.lang || DEFAULT_APP_LANG } as Record<
      string,
      string | boolean
    >,
    post =
      // in some cases _parent isn't defined during SSR...?
      (!preview &&
        _parent?.posts?.find?.((post) => post.slug?.current === params.slug)) ||
      handleLoadError(await findOne(fetch, 'post', opts));

  preview && (opts.preview = true);

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
