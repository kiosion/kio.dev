import { unwrapAPIResponse } from '$lib/api/result';
import type { SingleParams } from '$lib/api/store';
import { findOne } from '$lib/api/store';
import { BASE_PAGE_TITLE } from '$lib/consts';
import type { HeadingNode } from '$types/documents';
import type { GetPostQueryResult } from '$types/generated/sanity.types';

import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch, params }) => {
  const opts: SingleParams<'post'> = params;

  const [parentData, post] = await Promise.all([
    parent(),
    findOne(fetch, 'post', opts).then(
      (res) =>
        unwrapAPIResponse(res) as NonNullable<
          GetPostQueryResult & { headings: HeadingNode[] }
        >,
    ),
  ]);

  return {
    breadcrumbs: [
      ...parentData.breadcrumbs,
      { label: post.title, href: `/thoughts/${params.slug}` },
    ],
    post,
    meta: {
      title: `${post?.title} | ${BASE_PAGE_TITLE}`,
      desc: post?.desc
        ? post.desc.length > 160
          ? `${post.desc.slice(0, 160 - 3)}...`
          : post.desc
        : `A blog post on ${BASE_PAGE_TITLE}`,
    },
  };
}) satisfies PageLoad;
