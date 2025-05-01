import { endpointResponse } from '$lib/data.server';
import { getPost } from '$lib/sanity.server';

import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
  const params = {
    id: url.searchParams.get('id') ?? undefined,
    slug: url.searchParams.get('slug') ?? undefined,
    preview: !!url.searchParams.get('preview')
  };

  const res = await getPost(params);

  return endpointResponse(res, res.status);
}) satisfies RequestHandler;
