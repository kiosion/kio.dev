import { endpointResponse } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';
import { REMOTE_API_TOKEN } from '$lib/env.server';

import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
  const body = await request.json();

  switch (body.action) {
    case 'inc': {
      const { id } = body,
        remoteUrl = `${REMOTE_API_URL}/inc/${id}`,
        remoteRes = await fetch(remoteUrl, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${REMOTE_API_TOKEN}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify({ target: 'views' })
        })
          .then((res) => res.json())
          .catch((e) => ({ error: e }));

      if (remoteRes.message || remoteRes.error) {
        return endpointResponse(
          {
            status: remoteRes.code ?? 500,
            error: remoteRes.message ?? remoteRes.error,
            detail: remoteRes.detail
          },
          remoteRes.code ?? 500
        );
      }

      return endpointResponse({
        status: 200
      });
    }
    default: {
      return endpointResponse({ status: 400, error: 'Invalid action' }, 400);
    }
  }
}) satisfies RequestHandler;
