import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';

export const GET = async ({
  request,
  params,
  url
}: RequestEvent): Promise<RequestHandlerOutput> => {
  const remoteUrl = `${REMOTE_API_URL}query/posts${url.search}`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch posts: ${res.status}`, 'api/fetchPosts');
      return {
        body: JSON.stringify({
          status: res.status,
          error: 'Endpoint error: Failed to fetch posts'
        })
      };
    }
    const data = await res.json();
    return { body: data };
  } catch (err: any) {
    Logger.error(`Failed to fetch posts: ${err}`, 'api/fetchPosts');
    return {
      body: JSON.stringify({
        status: 500,
        error: (err && err?.message) || 'Endpoint error: Unknown error'
      })
    };
  }
};
