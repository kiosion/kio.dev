import { unwrapAPIResponse } from '$lib/api/result';
import { findOne } from '$lib/api/store';
import { BASE_DOMAIN } from '$lib/consts';
import { ENV } from '$lib/env';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ url, fetch }) => {
  const config = unwrapAPIResponse(
    await findOne(fetch, 'config')
  );

  return {
    breadcrumbs: [{ label: BASE_DOMAIN, href: '/' }],
    pathname: url.pathname,
    config
  };
}) satisfies LayoutLoad;
