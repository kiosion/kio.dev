import { isAPIFailure } from '$lib/api/result';
import { findOne } from '$lib/api/store';
import { ERRORS } from '$lib/consts';
import Robots from '$lib/fixtures/robots';

import type { RequestHandler } from './$types';

export const GET = (async ({ url, fetch }) => {
  const filename = url.pathname.split('/').pop();

  switch (filename) {
    case 'robots.txt':
      return new Response(Robots, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8',
        },
      });
    case 'pgp.txt': {
      const res = await findOne(fetch, 'config');
      if (isAPIFailure(res)) {
        return new Response(
          JSON.stringify({
            status: res.status,
            message: res.errors[0] || ERRORS.GENERIC_SOMETHING_WENT_WRONG,
            stack: res.errors.join('\n'),
          }),
          {
            status: res.status,
            headers: {
              'content-type': 'application/json',
              charset: 'utf-8',
            },
          },
        );
      }
      const { pgpKey } = res.data ?? {};
      return new Response(pgpKey as string, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8',
        },
      });
    }
    default:
      return new Response(
        JSON.stringify({
          status: 404,
          message: 'Not found',
        }),
        {
          headers: {
            'content-type': 'application/json',
            charset: 'utf-8',
          },
        },
      );
  }
}) satisfies RequestHandler;
