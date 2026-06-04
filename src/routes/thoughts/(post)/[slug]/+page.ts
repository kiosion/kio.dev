import { error } from '@sveltejs/kit';
import { BASE_PAGE_TITLE } from '$lib/consts';
import { loadPost } from '$lib/content';

import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
  const post = await loadPost(params.slug);

  if (!post) {
    throw error(404, 'Post not found');
  }

  const parentData = await parent();

  return {
    breadcrumbs: [
      ...parentData.breadcrumbs,
      { label: post.title, href: `/thoughts/${params.slug}` },
    ],
    post,
    meta: {
      title: `${BASE_PAGE_TITLE} — ${post.title}`,
      desc: post.desc
        ? post.desc.length > 160
          ? `${post.desc.slice(0, 160 - 3)}...`
          : post.desc
        : `A blog post on ${BASE_PAGE_TITLE}`,
    },
  };
}) satisfies PageLoad;
