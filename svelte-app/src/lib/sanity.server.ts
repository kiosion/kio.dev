import { isAPISuccess } from '$lib/api/result';
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

import type { APIFailure, APIResponse, Result } from '$lib/api/result';
import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult, GetPostsQueryResult } from '$types/sanity';

const clientConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: ENV === 'production',
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

const handleNoResults = <T>(res: T): APIResponse<T> =>
  res
    ? {
        status: 200,
        data: res
      }
    : {
        status: 404,
        errors: ['No results found']
      };

const handleSanityError = (err: Error): APIFailure => {
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

const processHeadings = <D extends Pick<NonNullable<GetPostQueryResult>, 'body'>>(
  d: D
): Result<D & { headings?: HeadingNode[] }> => {
  if (!d.body) {
    return [d, undefined];
  }

  const [headings, err] = buildSummary(d.body);
  if (err) {
    return [d, err];
  }

  return [
    {
      ...d,
      headings
    },
    undefined
  ];
};

export const incViews = async ({
  id
}: {
  id: string;
}): Promise<APIResponse<SanityDocument>> => {
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

export const getPosts = async ({
  tag,
  page = 0,
  limit = 10,
  preview = false
}: {
  tag?: string;
  page?: number;
  limit?: number;
  preview?: boolean;
}) => {
  const startNumber = page * limit;
  const endNumber = startNumber + limit;

  // TODO: Add tag filtering
  const result = await (preview ? previewClient : client)
    .fetch(GetPostsQuery, {
      startNumber,
      endNumber
    })
    .then(handleNoResults)
    .catch(handleSanityError);

  if (!isAPISuccess(result)) {
    return result;
  }

  // TODO: Reuse original query to narrow the count; this counts *everything* even w/ filters.
  const totalPosts = await (preview ? previewClient : client)
    .fetch(CountPostsQuery)
    .catch(() => 0);
  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = totalPosts > endNumber;
  const hasLess = startNumber > 0;

  const [posts, errs] = result.data.reduce(
    (acc: [GetPostsQueryResult, Error[]], post: GetPostsQueryResult[number]) => {
      const [postWithHeadings, err] = processHeadings(post);
      if (err) {
        acc[1].push(err);
      }
      acc[0].push(postWithHeadings || post);
      return acc;
    },
    [[], []]
  );

  return {
    status: 200,
    data: posts,
    errors: [...(result.errors ?? []), ...errs.map((e) => e.message)],
    meta: {
      total: totalPosts,
      count: result.data.length,
      hasMore,
      hasLess,
      page: {
        current: page,
        total: totalPages
      }
    }
  };
};

export const getPost = async ({
  slug,
  preview
}: {
  slug?: string;
  preview?: boolean;
}) => {
  if (!slug) {
    return {
      status: 400,
      errors: ['Missing slug']
    };
  }

  const result = await (preview ? previewClient : client)
    .fetch(GetPostQuery, { slug })
    .then(handleNoResults)
    .catch(handleSanityError);

  if (!isAPISuccess(result)) {
    return result;
  }

  const [post, err] = processHeadings(result.data);

  return {
    status: 200,
    data: post,
    errors: [...(result.errors ?? []), err ? err.message : undefined].filter(Boolean)
  };
};

export const getConfig = async ({ preview = false }: { preview?: boolean }) => {
  const config = await (preview ? previewClient : client)
    .fetch(GetConfigQuery)
    .then(handleNoResults)
    .catch(handleSanityError);

  if (!isAPISuccess(config)) {
    return config;
  }

  return {
    status: 200,
    data: config.data
  };
};
