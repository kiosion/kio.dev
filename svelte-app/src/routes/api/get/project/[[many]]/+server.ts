import type { RequestEvent, RequestHandler } from './$types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';
import Logger from '$lib/logger';
import Normalize from '$lib/data/normalize';

export const GET: RequestHandler = async ({
  url,
  params
}: RequestEvent): Promise<Response> => {
  const many = !!params.many;

  if (!many && !url.searchParams.get('id')) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing required parameter: id'
      })
    );
  }

  const remoteUrl = many
    ? `${REMOTE_API_URL}/query/projects?${url.searchParams}`
    : `${REMOTE_API_URL}/query/project/${
        url.searchParams.get('id') ||
        Buffer.from(
          (url.searchParams.get('idb') as string) || '',
          'base64'
        ).toString('utf-8')
      }`;

  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });

    const json = (await res.json()) as Record<string, unknown> & {
      data: Record<string, unknown> | undefined;
    };

    if (res.status !== 200 || !json?.data?.result) {
      Logger.error(
        `Failed to fetch ${many ? 'projects' : 'project'}: ${res.status}`
      );
      return new Response(
        JSON.stringify({
          status: 500,
          error: `Endpoint error: Failed to fetch ${
            many ? 'projects' : 'project'
          }. Remote API returned status code: ${res.status}`
        })
      );
    }
    const data = Normalize(json);
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    });
  } catch (err: unknown) {
    Logger.error(`Failed to fetch ${many ? 'projects' : 'project'}`);
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'Endpoint error: Unhandled or unknown error'
      })
    );
  }
};
