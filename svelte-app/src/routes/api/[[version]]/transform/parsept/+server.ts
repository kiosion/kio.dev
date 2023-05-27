import { getHeadings } from '$helpers/pt';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import type { PTBlock } from '$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  switch (body.action) {
    case 'parseHeadings': {
      const headings = await getHeadings((body?.data as PTBlock[]) ?? []);
      return json(headings);
    }
    default: {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
