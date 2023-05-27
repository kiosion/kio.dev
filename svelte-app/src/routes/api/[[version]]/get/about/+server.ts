import { fetchRemote } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
  const lang = url.searchParams.get('lang') || 'en';
  const endpoint = `${REMOTE_API_URL}/query/about?lang=${lang}`,
    remoteRes = await fetchRemote({ endpoint });

  if (remoteRes instanceof Error) {
    return new Response(
      JSON.stringify({
        status: 500,
        error: remoteRes.message
      }),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      }
    );
  }

  return new Response(JSON.stringify(remoteRes), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
};
