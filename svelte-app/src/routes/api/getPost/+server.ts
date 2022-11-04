import type { RequestEvent, RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
import Normalize from '$lib/data/normalize';

export const GET: RequestHandler = async ({
  url
}: RequestEvent): Promise<Response> => {
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing required param: id'
      })
    );
  }
  const remoteUrl = `${REMOTE_API_URL}/query/post/${id}`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch post: ${res.status}`, 'api/getPost');
      return new Response(
        JSON.stringify({
          status: 500,
          error: 'Endpoint error: Failed to fetch post',
          detail: `Remote API returned status code: ${res.status}`
        })
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const data = Normalize(await res.json());
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  } catch (err: unknown) {
    Logger.error('Failed to fetch post', 'api/fetchPost');
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'Endpoint error: Unknown error'
      })
    );
  }
};
