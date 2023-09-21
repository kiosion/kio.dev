import { DEFAULT_APP_LANG } from '$lib/consts';
import { ENV } from '$lib/env';
import { findOne } from '$lib/store';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';

export const ssr = !(ENV === 'testing');

export const load = (async ({ params, url, fetch }) => {
  const lang = params.lang || DEFAULT_APP_LANG;

  return {
    pathname: url.pathname,
    author: await findOne(fetch, 'about', { lang })
  };
}) satisfies LayoutLoad;
