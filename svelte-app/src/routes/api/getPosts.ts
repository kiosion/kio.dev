import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';
import { REMOTE_API_URL } from '@/lib/env';

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
        authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      throw new Error(`Endpoint error: ${res.status}`);
    }
    const data = await res.json();
    return { body: data };
  } catch (err) {
    return {
      body: JSON.stringify({
        status: 500,
        error: err
      })
    };
  }
};
