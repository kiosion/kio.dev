import type { RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
import Normalize from '$lib/data/normalize';

export const GET: RequestHandler = async (): Promise<Response> => {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const data = Normalize(await res.json());
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  } catch (err) {
    const error = err as Error;
    Logger.error(
      `Endpoint failed to fetch about: ${error?.message}`,
      'api/get/about'
    );
    return new Response(
      JSON.stringify({
        status: 500,
        error: error?.message ? error.message : 'Endpoint error: Unknown error'
      }),
      {
        // @ts-expect-error Status may exist on custom Errors
        status: (error?.status as number) ?? 500
      }
    );
  }
};
