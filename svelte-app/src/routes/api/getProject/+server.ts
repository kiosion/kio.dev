import type {
  RequestEvent,
  RequestHandler,
  RequestHandlerOutput
} from './types';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';

export const GET: RequestHandler = async ({
  url
}: RequestEvent): Promise<RequestHandlerOutput> => {
  const remoteUrl = `${REMOTE_API_URL}query/project${url.search}`;
  try {
    const res = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${REMOTE_API_TOKEN}`
      }
    });
    if (res.status !== 200) {
      Logger.error(`Failed to fetch project: ${res.status}`, 'api/getProject');
      return new Response(
        JSON.stringify({
          status: res.status,
          error: 'Endpoint error: Failed to fetch project'
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
  } catch (err: unknown) {
    Logger.error(`Failed to fetch project: ${err}`, 'api/fetchProject');
    return new Response(
      JSON.stringify({
        status: 500,
        error: (err && err?.message) || 'Endpoint error: Unknown error'
      })
    );
  }
};
