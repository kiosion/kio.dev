import Robots from '$lib/fixtures/robots';
import { security } from '$lib/fixtures/well-known';

import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
  const filename = url.pathname.split('/').pop();

  switch (filename) {
    case 'security.txt':
      return new Response(security, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8'
        }
      });
    case 'robots.txt':
      return new Response(Robots, {
        headers: {
          'content-type': 'text/plain',
          charset: 'utf-8'
        }
      });
    default:
      return new Response(
        JSON.stringify({
          status: 404,
          message: 'Not found'
        }),
        {
          headers: {
            'content-type': 'application/json',
            charset: 'utf-8'
          }
        }
      );
  }
}) satisfies RequestHandler;
