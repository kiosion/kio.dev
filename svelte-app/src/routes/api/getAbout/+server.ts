import type { RequestHandler, RequestHandlerOutput } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';

export const GET: RequestHandler = async (): Promise<RequestHandlerOutput> => {
  const remoteUrl = `${REMOTE_API_URL}/query/about`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch about: ${res.status}`, 'api/fetchAbout');
      return new Response(
        JSON.stringify({
          status: 500,
          error: 'Endpoint failed to fetch about',
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
    Logger.error(
      `Endpoint failed to fetch about, caught: ${err}`,
      'api/fetchAbout'
    );
    return new Response(
      JSON.stringify({
        status: 500,
        error: err?.message ? err.message : 'Endpoint error: Unknown error'
      })
    );
  }
};
