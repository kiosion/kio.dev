import { isAPIError } from '$lib/api/types';
import { buildSummary } from '$lib/data.server';
import { ENV } from '$lib/env';
import {
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID
} from '$lib/env.server';
import {
  CountPostsQuery,
  GetConfigQuery,
  GetPostQuery,
  GetPostsQuery
} from '$lib/sanity.queries.server';

import { ClientError, createClient, type SanityDocument } from '@sanity/client';

import type {
  GetConfigParamsSchema,
  GetPostParamsSchema,
  GetPostsParamsSchema
} from '$lib/api/schemas';
import type { APIResponse } from '$lib/api/types';
import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult } from '$types/sanity';
import type { z } from 'zod';

const clientConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  // useCdn: ENV === 'production',
  useCdn: true,
  apiVersion: SANITY_API_VERSION,
  token: SANITY_API_TOKEN
};

const client = createClient({
  ...clientConfig,
  perspective: 'published'
});

const previewClient = createClient({
  ...clientConfig,
  perspective: 'drafts'
});

const handleNoResults = <T>(res: T) =>
  res
    ? {
        status: 200,
        data: res
      }
    : {
        status: 404,
        errors: ['No results found']
      };

const handleSanityError = (err: Error) => {
  const errorResp = {
    status: 500,
    errors: ['Failed to fetch data']
  };

  if (err instanceof ClientError) {
    errorResp.status = err.response?.statusCode || 500;
    errorResp.errors.push(
      `Sanity Error: ${err.details.type}: ${err.details.description}`
    );
  } else {
    errorResp.errors.push(err.message || 'An unknown error occurred');
  }

  return errorResp;
};

const processHeadings = <T extends GetPostQueryResult>(
  res: APIResponse<T>
): APIResponse<T & { headings: HeadingNode[] }> => {
  if (isAPIError(res)) {
    return res;
  }

  const headings = buildSummary(res.data?.body);

  return {
    ...res,
    data: {
      ...res.data,
      headings: headings ?? []
    }
  };
};

export const incViews = async ({ id }: { id: string }) => {
  const res = (await client
    .patch(id)
    .setIfMissing({ views: 0 })
    .inc({ views: 1 })
    .commit()
    .then((res) => ({
      status: 200,
      errors: [],
      data: res
    }))
    .catch((err) => {
      if (err instanceof ClientError) {
        return {
          status: err.response?.statusCode || 500,
          errors: [`Sanity Error: ${err.details?.type}: ${err.details?.description}`]
        };
      }
      return {
        status: 500,
        errors: [err.message || 'An unknown error occurred']
      };
    })) satisfies APIResponse<SanityDocument>;

  return res;
};

export const getPosts = async (params: z.output<typeof GetPostsParamsSchema>) => {
  const { page, limit, preview } = params;

  const startNumber = page * limit;
  const endNumber = startNumber + limit;

  const result = await (preview ? previewClient : client)
    .fetch(GetPostsQuery, {
      startNumber,
      endNumber
    })
    .then(handleNoResults)
    .catch(handleSanityError);

  if (isAPIError(result)) {
    return result;
  }

  const totalPosts = await (preview ? previewClient : client)
    .fetch(CountPostsQuery)
    .catch(() => 0);
  const totalPages = Math.ceil(totalPosts / limit);

  return {
    status: 200,
    data: result.data,
    errors: result.errors ?? [],
    meta: {
      total: totalPosts,
      count: result.data.length,
      page: {
        current: page,
        total: totalPages,
        limit
      }
    }
  };
};

export const getPost = async (params: z.output<typeof GetPostParamsSchema>) => {
  const { slug } = params;

  const result = await (params.preview ? previewClient : client)
    .fetch(GetPostQuery, { slug })
    .then(handleNoResults)
    .then(processHeadings)
    .catch(handleSanityError);

  if (isAPIError(result)) {
    return result;
  }

  return {
    status: 200,
    data: result.data,
    errors: result.errors ?? []
  };
};

export async function getConfig(params: z.output<typeof GetConfigParamsSchema>) {
  const data = await (params.preview ? previewClient : client)
    .fetch(GetConfigQuery)
    .then(handleNoResults)
    .catch(handleSanityError);

  if (isAPIError(data)) {
    return data;
  }

  return {
    status: 200,
    data: data.data
  };
}
