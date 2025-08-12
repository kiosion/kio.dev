import { unwrapAPIResponse } from '$lib/api/result';
import { findOne } from '$lib/api/store';
import { ENV } from '$lib/env';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ url, fetch }) => {
  const config = unwrapAPIResponse(
    await findOne(fetch, 'config')
  );

  return { pathname: url.pathname, config };
}) satisfies LayoutLoad;
