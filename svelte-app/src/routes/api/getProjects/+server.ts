import type { RequestEvent, RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
import Normalize from '$lib/data/normalize';

export const GET: RequestHandler = async ({ url }: RequestEvent) => {
  const remoteUrl = `${REMOTE_API_URL}/query/projects${url.search}`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(
        `Failed to fetch projects: ${res.status}`,
        'api/getProjects'
      );
      return new Response(
        JSON.stringify({
          status: 500,
          error: 'Endpoint error: Failed to fetch projects',
          detail: `Remote API returned status code: ${res.status}`
        })
      );
    }
    const data = Normalize(await res.json());
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  } catch (err: unknown) {
    Logger.error(`Failed to fetch projects: ${err}`, 'api/fetchProjects');
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'Endpoint error: Unknown error'
      })
    );
  }
};
