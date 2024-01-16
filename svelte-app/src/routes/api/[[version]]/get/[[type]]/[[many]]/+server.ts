import { VALID_DOC_TYPES } from '$lib/consts';
import { endpointResponse, fetchRemote } from '$lib/data.server';
import { REMOTE_API_URL } from '$lib/env';

import type { RequestHandler } from './$types';

export const GET = (async ({ url, params }) => {
  const docType = params.type as (typeof VALID_DOC_TYPES)[number],
    many = !!params.many;

  if (!VALID_DOC_TYPES.includes(docType)) {
    return endpointResponse(
      {
        status: 400,
        error: 'Endpoint error: Missing or invalid parameter: type'
      },
      400
    );
  }

  if (
    (docType === 'post' || docType === 'project') &&
    !many &&
    !url.searchParams.get('id')
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

  const endpoint = getEndpoint(docType, many, url.searchParams),
    remoteRes = await fetchRemote(endpoint);

  if (remoteRes.error) {
    return endpointResponse(
      {
        status: remoteRes.code,
        error: remoteRes.error,
        detail: remoteRes.detail
      },
      remoteRes.code
    );
  }

  return endpointResponse(remoteRes);
}) satisfies RequestHandler;

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
        : `${REMOTE_API_URL}/query/${type}/${params.get('id')}?lang=${
            params.get('lang') || 'en'
          }${params.get('preview') === 'true' ? '&preview=true' : ''}`;
    case 'config':
      return `${REMOTE_API_URL}/config?lang=${params.get('lang') || 'en'}`;
  }
};
