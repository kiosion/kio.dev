import { DEFAULT_FILTER_QUERY_PARAMS, VALID_DOC_TYPES } from '$lib/consts';
import { endpointResponse } from '$lib/data.server';
import {
  getConfig,
  getPost,
  getPosts,
  getProject,
  getProjects
} from '$lib/sanity.server';

import type { RequestHandler } from './$types';
import type { APIResponse } from '$lib/api/client';
import type { Model } from '$lib/api/store';

export const GET = (async ({ url, params }) => {
  const docType = params.type as Model,
    many = !!params.many;

  let res: APIResponse<unknown>;

  // TODO: tidy this up, centralize logic from 'store' here instead, handle translation w/ Gtranslate API, properly type responses
  if (['post', 'project'].includes(docType) && many) {
    // @ts-expect-error - TODO: fix this
    res = await (docType === 'post' ? getPosts : getProjects)({
      page: parseInt(
        url.searchParams.get('page') ?? DEFAULT_FILTER_QUERY_PARAMS.page.toString()
      ),
      limit: parseInt(
        url.searchParams.get('limit') ?? DEFAULT_FILTER_QUERY_PARAMS.limit.toString()
      ),
      sort: url.searchParams.get('sort') ?? DEFAULT_FILTER_QUERY_PARAMS.sort,
      order: url.searchParams.get('order') ?? DEFAULT_FILTER_QUERY_PARAMS.order,
      preview: !!url.searchParams.get('preview')
    });
  } else if (['post', 'project'].includes(docType) && !many) {
    res = await (docType === 'post' ? getPost : getProject)({
      id: url.searchParams.get('id') ?? undefined,
      slug: url.searchParams.get('slug') ?? undefined,
      preview: !!url.searchParams.get('preview')
    });
  } else if (docType === 'config') {
    res = await getConfig({ preview: !!url.searchParams.get('preview') });
  } else {
    return endpointResponse(
      {
        status: 400,
        errors: ['Missing or invalid parameter: type']
      },
      400
    );
  }

  return endpointResponse(res, res.status);
}) satisfies RequestHandler;
