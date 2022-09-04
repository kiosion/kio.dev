import type { RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
// import { gateRequest } from '$lib/api';

export const GET: RequestHandler = async ({
  getClientAddress
}): Promise<Response> => {
  // TODO
  // if (gateRequest(getClientAddress())) {
  //   return new Response(
  //     JSON.stringify({
  //       status: 429,
  //       error: 'Request ratelimited'
  //     }), {
  //       status: 429
  //     }
  //   );
  // }

  const remoteUrl = `${REMOTE_API_URL}/query/about`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch about: ${res.status}`, 'api/get/about');
      return new Response(
        JSON.stringify({
          status: 500,
          message: `Failed to fetch about, API returned ${res.status}`
        }),
        {
          status: res.status ?? 500
        }
      );
    }
    return new Response(res.body, {
      headers: {
        'content-type': 'application/json',
        charset: 'utf-8'
      }
    });
  } catch (err) {
    const error = err as Record<string, unknown>;
    Logger.error(
      `Endpoint failed to fetch about, caught: ${err}`,
      'api/get/about'
    );
    return new Response(
      JSON.stringify({
        status: 500,
        error: error?.message ? error.message : 'Endpoint error: Unknown error'
      }),
      {
        status: error?.status ?? 500
      }
    );
  }
};
