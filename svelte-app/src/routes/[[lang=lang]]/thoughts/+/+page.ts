import type { PageLoad } from './$types';
import type { DocumentTags, PostDocument } from '$types';

const UNCATEGORIZED_TAG = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  slug: { _id: 'uncategorized', current: 'uncategorized' }
} satisfies Pick<DocumentTags, '_id' | 'slug' | 'title'>;

export const load = (async ({ parent }) => {
  const _parent = await parent(),
    tags = new Set<Pick<DocumentTags, '_id' | 'slug' | 'title'>>(),
    postsByTag = new Map<Pick<DocumentTags, '_id' | 'slug' | 'title'>, PostDocument[]>();

  for (const post of _parent.posts ?? []) {
    if (!post.tags?.length) {
      !tags.has(UNCATEGORIZED_TAG) && tags.add(UNCATEGORIZED_TAG);
      postsByTag.set(UNCATEGORIZED_TAG, [
        ...(postsByTag.get(UNCATEGORIZED_TAG) ?? []),
        post
      ]);
      continue;
    }

    for (const tag of post.tags) {
      !tags.has(tag) && tags.add(tag);
      postsByTag.set(tag, [...(postsByTag.get(tag) ?? []), post]);
    }
  }

  return { tags: Array.from(tags), postsByTag };
}) satisfies PageLoad;
