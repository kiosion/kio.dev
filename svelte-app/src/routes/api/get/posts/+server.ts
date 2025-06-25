import { DEFAULT_FILTER_QUERY_PARAMS } from '$lib/consts';
import { endpointResponse } from '$lib/data.server';
import { getPosts } from '$lib/sanity.server';

import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
  const params = {
    page: parseInt(
      url.searchParams.get('page') ?? DEFAULT_FILTER_QUERY_PARAMS.page.toString()
    ),
    limit: parseInt(
      url.searchParams.get('limit') ?? DEFAULT_FILTER_QUERY_PARAMS.limit.toString()
    ),
    sort: url.searchParams.get('sort') ?? DEFAULT_FILTER_QUERY_PARAMS.sort,
    order: url.searchParams.get('order') ?? DEFAULT_FILTER_QUERY_PARAMS.order,
    preview: !!url.searchParams.get('preview')
  };

  const res = await getPosts(params);

  return endpointResponse(res, res.status);
}) satisfies RequestHandler;
