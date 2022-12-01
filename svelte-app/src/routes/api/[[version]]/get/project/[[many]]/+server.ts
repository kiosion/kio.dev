import type { RequestEvent, RequestHandler } from './$types';
import { REMOTE_API_URL } from '$lib/env';
import { fetchRemote } from '$lib/data.server';

export const GET: RequestHandler = async ({
  url,
  params
}: RequestEvent): Promise<Response> => {
  const many = !!params.many;

  if (!many && !url.searchParams.get('id')) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing required parameter: id'
      }),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      }
    );
  }

  const endpoint = many
      ? `${REMOTE_API_URL}/query/projects?${url.searchParams}`
      : `${REMOTE_API_URL}/query/project/${
          url.searchParams.get('id') ||
          Buffer.from(
            (url.searchParams.get('idb') as string) || '',
            'base64'
          ).toString('utf-8')
        }`,
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

  return new Response(JSON.stringify(remoteRes));
};
