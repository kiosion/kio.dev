import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';
import { REMOTE_API_URL, REMOTE_API_TOKEN } from '$lib/env';

export const GET = async ({
  request,
  params,
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
      Logger.error(
        `Failed to fetch project: ${res.status}`,
        'api/fetchProject'
      );
      return {
        body: JSON.stringify({
          status: res.status,
          error: 'Endpoint error: Failed to fetch project'
        })
      };
    }
    const data = await res.json();
    return { body: data };
  } catch (err: any) {
    Logger.error(`Failed to fetch project: ${err}`, 'api/fetchProject');
    return {
      body: JSON.stringify({
        status: 500,
        error: (err && err?.message) || 'Endpoint error: Unknown error'
      })
    };
  }
};
