import type { RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
import Normalize from '$lib/data/normalize';

export const GET: RequestHandler = async () => {
  const remoteUrl = `${REMOTE_API_URL}/config`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch config: ${res.status}`, 'api/get/config');
      return new Response(
        JSON.stringify({
          status: 500,
          error: `Endpoint error: Failed to fetch config: ${res.status}`,
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
  } catch (err) {
    Logger.error('Failed to fetch config', 'api/get/config');
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'Endpoint error: Unknown error'
      })
    );
  }
};
