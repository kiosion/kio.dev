import { fetchRemote } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';

import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({
  url,
  params
}: RequestEvent): Promise<Response> => {
  const many = !!params.many,
    type = url.searchParams.get('type');

  if (!many) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: method not supported for single items'
      })
    );
  }

  if (!['project', 'post'].includes(type ?? '')) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing or invalid required parameter: type'
      }),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      }
    );
  }

  const endpoint = new URL(`${REMOTE_API_URL}/query/tags?${url.searchParams}`),
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
