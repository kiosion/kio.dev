import { fetchRemote } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';

import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({
  url,
  params
}: RequestEvent): Promise<Response> => {
  const many = !!params.many;

  if (!many && !url.searchParams.get('id') && !url.searchParams.get('idb')) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing required parameter: id'
      })
    );
  }

  const lang = url.searchParams.get('lang') || 'en',
    endpoint = many
      ? `${REMOTE_API_URL}/query/posts?${url.searchParams}`
      : `${REMOTE_API_URL}/query/post/${
          url.searchParams.get('id') ||
          Buffer.from((url.searchParams.get('idb') as string) || '', 'base64').toString(
            'utf-8'
          )
        }?lang=${lang}`,
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
