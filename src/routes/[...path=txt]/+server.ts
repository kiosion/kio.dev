import Robots from '$lib/fixtures/robots';
import { security } from '$lib/fixtures/well-known';
import { siteConfig } from '$lib/site-config';

import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => [
  { path: 'robots.txt' },
  { path: 'pgp.txt' },
  { path: '.well-known/security.txt' },
];

const txt = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });

export const GET = (({ params }) => {
  switch (params.path) {
    case 'robots.txt':
      return txt(Robots);
    case 'pgp.txt':
      return siteConfig.pgpKey ? txt(siteConfig.pgpKey) : txt('Not found', 404);
    case '.well-known/security.txt':
      return txt(security);
    default:
      return txt('Not found', 404);
  }
}) satisfies RequestHandler;
