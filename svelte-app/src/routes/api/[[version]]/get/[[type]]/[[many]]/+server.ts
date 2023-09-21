import { VALID_DOC_TYPES } from '$lib/consts';
import { fetchRemote } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';

import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({
  url,
  params
}: RequestEvent): Promise<Response> => {
  const docType = params.type as (typeof VALID_DOC_TYPES)[number],
    many = !!params.many ?? false;

  if (!VALID_DOC_TYPES.includes(docType)) {
    return new Response(
      JSON.stringify({
        status: 400,
        error: 'Endpoint error: Missing or invalid parameter: type'
      }),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      }
    );
  }

  if (
    docType === 'tag' &&
    !['post', 'project'].includes(url.searchParams.get('type') || '')
  ) {
    return endpointResponse(
      {
        status: 400,
        error: 'Endpoint error: Missing or invalid query parameter: type'
      },
      400
    );
  }

  if (
    ['post', 'project'].includes(docType) &&
    !many &&
    !(url.searchParams.get('id') || url.searchParams.get('idb'))
  ) {
    return endpointResponse(
      {
        status: 400,
        error: 'Endpoint error: Missing or invalid query parameter: id'
      },
      400
    );
  }

  url.searchParams.delete('many');

  const endpoint = getEndpoint(docType, many, url.searchParams);

  const remoteRes = await fetchRemote({ endpoint });

  if (remoteRes.error) {
    return endpointResponse(
      {
        status: remoteRes.code,
        error: remoteRes.error
      },
      remoteRes.code
    );
  }

  return endpointResponse(remoteRes);
};

const getEndpoint = (
  type: (typeof VALID_DOC_TYPES)[number],
  many: boolean,
  params: URLSearchParams
): string => {
  switch (type) {
    case 'post':
    case 'project':
      return many
        ? `${REMOTE_API_URL}/query/${type}s?${params}`
        : `${REMOTE_API_URL}/query/${type}/${
            params.get('id') ||
            Buffer.from((params.get('idb') as string) || '', 'base64').toString('utf-8')
          }?lang=${params.get('lang') || 'en'}${
            params.get('preview') === 'true' ? '&preview=true' : ''
          }`;
    case 'tag':
      return `${REMOTE_API_URL}/query/tags?${params}`;
    case 'config':
      return `${REMOTE_API_URL}/config`;
    case 'about':
      return `${REMOTE_API_URL}/query/about?lang=${params.get('lang') || 'en'}`;
  }
};

const endpointResponse = (content: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(content), {
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    status
  });
};
