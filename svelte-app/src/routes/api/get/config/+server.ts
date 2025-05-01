import { endpointResponse } from '$lib/data.server';
import { getConfig } from '$lib/sanity.server';

import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
  const params = { preview: !!url.searchParams.get('preview') };

  const res = await getConfig(params);

  return endpointResponse(res, res.status);
}) satisfies RequestHandler;
