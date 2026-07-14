import { error } from '@sveltejs/kit';
import { BASE_PAGE_TITLE } from '$lib/consts';
import { getAllPosts, loadPost } from '$lib/content';

import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
  const post = await loadPost(params.slug);

  if (!post) {
    throw error(404, 'Post not found');
  }

  const parentData = await parent();

  // Neighbours in the date-desc manifest: newer sits before, older after.
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === params.slug);
  const adjacent = {
    newer: idx > 0 ? posts[idx - 1] : null,
    older: idx !== -1 ? (posts[idx + 1] ?? null) : null,
  };

  return {
    adjacent,
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
