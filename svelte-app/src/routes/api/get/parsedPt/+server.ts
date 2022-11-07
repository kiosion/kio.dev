import { json } from '@sveltejs/kit';
import { getHeadings } from '$helpers/pt';
import type { PTBlock } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json(),
    headings = await getHeadings((body as PTBlock[]) ?? []);
  return json(headings);
};
