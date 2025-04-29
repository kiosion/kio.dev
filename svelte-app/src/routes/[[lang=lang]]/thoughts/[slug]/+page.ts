import { unwrap } from '$lib/api/result';
import { findOne, incViews } from '$lib/api/store';
import { DEFAULT_APP_LANG } from '$lib/consts';

import type { PageLoad } from './$types';
import type { SingleParams } from '$lib/api/store';

export const load = (async ({ parent, fetch, params, url }) => {
  const _parent = await parent(),
    preview = url.searchParams.get('preview') === 'true',
    opts: SingleParams<'post'> = {
      id: params.slug,
      lang: params.lang || DEFAULT_APP_LANG
    };

  preview && (opts.preview = true);

  const post =
    // in some cases _parent isn't defined during SSR...?
    (!preview &&
      opts.lang === DEFAULT_APP_LANG &&
      _parent?.posts?.find?.((post) => post.slug?.current === params.slug)) ||
    unwrap(await findOne(fetch, 'post', opts));

  if (post) {
    await incViews(fetch, post).then(([data, _]) => {
      if (data) {
        post.views = data.views;
      }
    });
  }

  return { post, routeFetch: fetch };
}) satisfies PageLoad;
