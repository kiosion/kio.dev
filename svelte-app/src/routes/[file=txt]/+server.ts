import Robots from '$lib/fixtures/robots';
import { siteConfig } from '$lib/site-config';

import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
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
      if (!siteConfig.pgpKey) {
        return new Response('Not found', {
          status: 404,
          headers: { 'content-type': 'text/plain', charset: 'utf-8' },
        });
      }
      return new Response(siteConfig.pgpKey, {
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
          status: 404,
          headers: {
            'content-type': 'application/json',
            charset: 'utf-8',
          },
        },
      );
  }
}) satisfies RequestHandler;
