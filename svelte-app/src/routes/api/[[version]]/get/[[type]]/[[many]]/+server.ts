import { VALID_DOC_TYPES } from '$lib/consts';
import { endpointResponse } from '$lib/data.server';
import { getConfig, getPost, getPosts } from '$lib/sanity.server';

import type { RequestHandler } from './$types';

export const GET = (async ({ url, params }) => {
  const docType = params.type as (typeof VALID_DOC_TYPES)[number],
    many = !!params.many;

  const id = url.searchParams.get('id'),
    slug = url.searchParams.get('slug'),
    preview = url.searchParams.get('preview'),
    page = url.searchParams.get('page'),
    limit = url.searchParams.get('limit'),
    tag = url.searchParams.get('tag');

  if ((docType === 'post' || docType === 'project') && !many && !id && !slug) {
    return endpointResponse(
      {
        status: 400,
        errors: ['Endpoint error: Missing or invalid query parameter: id']
      },
      400
    );
  }

  // TODO: tidy this up, centralize logic from 'store' here instead, handle translation w/ Gtranslate API, properly type responses
  switch (docType) {
    case 'post': {
      if (many) {
        const res = await getPosts({
          tag: tag ? tag : undefined,
          page: page ? parseInt(page) : 0,
          limit: limit ? parseInt(limit) : 10,
          preview: preview === 'true'
        });
        return endpointResponse(res, res.status);
      }
      // @ts-expect-error - Need to fix types for getPost opts.
      const res = await getPost({
        id: id ? id : undefined,
        slug: slug ? slug : undefined,
        preview: preview === 'true'
      });
      return endpointResponse(res, res.status);
    }
    case 'project': {
      if (many) {
        const res = await getPosts({
          tag: tag ? tag : undefined,
          page: page ? parseInt(page) : 0,
          limit: limit ? parseInt(limit) : 10,
          preview: preview === 'true'
        });
        return endpointResponse(res, res.status);
      }
      // @ts-expect-error - Need to fix types for getPost opts.
      const res = await getProject({
        id: id ? id : undefined,
        slug: slug ? slug : undefined,
        preview: preview === 'true'
      });
      return endpointResponse(res, res.status);
    }
    case 'config': {
      const res = await getConfig();
      return endpointResponse(res, res.status);
    }
  }

  return endpointResponse(
    {
      status: 400,
      errors: ['Endpoint error: Missing or invalid parameter: type'],
      data: undefined
    },
    400
  );
}) satisfies RequestHandler;
