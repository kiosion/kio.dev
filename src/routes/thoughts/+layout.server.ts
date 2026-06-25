import { getAllPosts } from '$lib/content';

import type { LayoutServerLoad } from './$types';

const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const load = (async ({ parent, params }) => {
  const parentData = await parent();
  const posts = getAllPosts();

  const tagCounts: Record<string, number> = {};
  const tagTitles: Record<string, string> = {};

  for (const p of posts) {
    for (const t of p.tags ?? []) {
      const slug = tagSlug(t);
      if (!slug) {
        continue;
      }
      tagCounts[slug] = (tagCounts[slug] ?? 0) + 1;
      tagTitles[slug] = t;
    }
  }

  const tags = Object.keys(tagCounts)
    .map((slug) => ({ slug, title: tagTitles[slug], count: tagCounts[slug] }))
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));

  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: 'Thoughts', href: '/thoughts' }],
    posts: params.slug
      ? posts.filter((p) => (p.tags ?? []).some((t) => tagSlug(t) === params.slug))
      : posts,
    tags,
    tagCounts,
  };
}) satisfies LayoutServerLoad;
