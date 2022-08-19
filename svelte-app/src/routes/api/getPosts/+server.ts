import type {
  RequestEvent,
  RequestHandler,
  RequestHandlerOutput
} from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';

export const GET: RequestHandler = async ({
  url
}: RequestEvent): Promise<RequestHandlerOutput> => {
  const remoteUrl = `${REMOTE_API_URL}query/posts${url.search}`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch posts: ${res.status}`, 'api/getPosts');
      return new Response(
        JSON.stringify({
          status: 500,
          error: 'Endpoint error: Failed to fetch posts',
          detail: `Remote API returned status code: ${res.status}`
        })
      );
    }
    const data = await res.json();
    return new Response(
      JSON.stringify(data, {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      })
    );
  } catch (err: Error) {
    Logger.error(`Failed to fetch posts: ${err}`, 'api/fetchPosts');
    return new Response(
      JSON.stringify({
        status: 500,
        error: err?.message ? err.message : 'Endpoint error: Unknown error'
      })
    );
  }
};
