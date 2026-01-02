import { unwrapAPIResponse } from '$lib/api/result';
import { find } from '$lib/api/store';
import { DEFAULT_POST_QUERY_PARAMS } from '$lib/consts';

import type { LayoutLoad } from './$types';

export const load = (async ({ parent, fetch }) => {
  const parentData = await parent();
  const posts = unwrapAPIResponse(
    await find(fetch, 'post', DEFAULT_POST_QUERY_PARAMS)
  );
  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: 'Thoughts', href: '/thoughts' }],
    posts
  };
}) satisfies LayoutLoad;
