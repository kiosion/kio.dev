import type { RequestHandler } from './$types';
import { REMOTE_API_URL } from '$lib/env';
import { fetchRemote } from '$lib/data.server';

export const GET: RequestHandler = async ({
  url,
  params
}): Promise<Response> => {
  const _many = !!params.many;

  // Get document ID from params
  const queryParams = url.searchParams,
    id = queryParams.get('id'),
    showUnapproved = queryParams.get('showUnapproved') === 'true';

  if (!id) {
    return new Response(JSON.stringify({ error: 'No ID provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Get document from Sanity
  const endpoint = `${REMOTE_API_URL}/query/comments/${id}?force=${
      showUnapproved ? 'true' : 'false'
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

  return new Response(JSON.stringify(remoteRes), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });
};
