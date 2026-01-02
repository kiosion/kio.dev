import { browser } from '$app/environment';
import { unwrapAPIResponse } from '$lib/api/result';
import { findOne } from '$lib/api/store';

import type { PageLoad } from './$types';
import type { SingleParams } from '$lib/api/store';
import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult } from '$types/generated/sanity.types';

export const load = (async ({ parent, fetch, params }) => {
  const opts: SingleParams<'post'> = params;

  let post: NonNullable<GetPostQueryResult & { headings: HeadingNode[] }> | undefined;

  const parentData = await parent();

  if (browser) {
    post = parentData?.posts?.find?.((p) => p.slug?.current === params.slug);
  }

  if (!post) {
    post = unwrapAPIResponse(await findOne(fetch, 'post', opts));
  }

  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: post.title, href: `/thoughts/${params.slug}` }],
    post,
    routeFetch: fetch
  };
}) satisfies PageLoad;
