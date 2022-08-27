import type { RequestHandler, RequestHandlerOutput } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';

export const GET: RequestHandler = async (): Promise<RequestHandlerOutput> => {
  const remoteUrl = `${REMOTE_API_URL}/query/siteSettings`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    console.log('endpoint res: ', res.status);
    if (res.status !== 200) {
      Logger.error(`Failed to fetch config: ${res.status}`, 'api/getConfig');
      return new Response(
        JSON.stringify({
          status: 500,
          error: `Endpoint error: Failed to fetch config:sadf ${res.status}`,
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
  } catch (err) {
    Logger.error(`Failed to fetch config: ${err}`, 'api/getConfig');
    return new Response(
      JSON.stringify({
        status: 500,
        error: err?.message ?? 'Endpoint error: Unknown error'
      })
    );
  }
};
