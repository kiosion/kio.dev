import { DEFAULT_APP_LANG } from '$lib/consts';
import { findOne } from '$lib/store';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';

export const load = (async ({ params, url, fetch }) => {
  const lang = params.lang || DEFAULT_APP_LANG;

  const promises = await Promise.all([
    findOne(fetch, 'about', { lang }),
    findOne(fetch, 'config')
  ]);

  return {
    pathname: url.pathname,
    author: promises[0],
    config: promises[1]
  };
}) satisfies LayoutLoad;
