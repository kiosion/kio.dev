import { getAllPosts } from '$lib/content';

import type { EntryGenerator, PageLoad } from './$types';

const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const entries: EntryGenerator = () => {
  const slugs = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      const slug = tagSlug(tag);
      if (slug) {
        slugs.add(slug);
      }
    }
  }
  return [...slugs].map((slug) => ({ slug }));
};

export const load = (async ({ parent, params }) => {
  const parentData = await parent();

  const activeTagTitle = parentData.tags.find((t) => t.slug === params.slug)?.title;

  return {
    breadcrumbs: [
      ...parentData.breadcrumbs,
      { label: `#${activeTagTitle}`, href: `/thoughts/+/${params.slug}` },
    ],
  };
}) satisfies PageLoad;
