import { endpointResponse } from '$lib/data.server';
import { incViews } from '$lib/sanity.server';

import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
  const body = await request.json();

  switch (body.action) {
    case 'inc': {
      const { id } = body;
      const res = await incViews({ id });
      return endpointResponse(res, res.status);
    }
    default: {
      return endpointResponse({ status: 400, errors: ['Invalid action'] }, 400);
    }
  }
}) satisfies RequestHandler;
