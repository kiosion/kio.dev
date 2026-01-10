import { unwrapAPIResponse } from '$lib/api/result';
import { find, findOne } from '$lib/api/store';
import { BASE_DOMAIN, HOMEPAGE_POSTS_NUM } from '$lib/consts';
import { ENV } from '$lib/env';
import { getPageMeta } from '$lib/nav.svelte';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ data, url, fetch }) => {
  const [posts, config] = await Promise.all([
    unwrapAPIResponse(await find(fetch, 'post', { limit: HOMEPAGE_POSTS_NUM })),
    unwrapAPIResponse(await findOne(fetch, 'config')),
  ]);

  return {
    breadcrumbs: [{ label: BASE_DOMAIN, href: '/' }],
    initialTheme: data?.initialTheme || 'system',
    meta: getPageMeta(url.pathname),
    pathname: url.pathname,
    config,
    posts,
    fetch,
  };
}) satisfies LayoutLoad;
