import type { LayoutLoad } from './$types';
import type { DocumentTags, PostDocument } from '$types';

const UNCATEGORIZED_TAG = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  slug: { _id: 'uncategorized', current: 'uncategorized' }
} satisfies Pick<DocumentTags, '_id' | 'slug' | 'title'>;

export const load = (async ({ parent }) => {
  const _parent = await parent(),
    tags: Pick<DocumentTags, '_id' | 'slug' | 'title'>[] = [],
    postsByTag = new Map<Pick<DocumentTags, '_id' | 'slug' | 'title'>, PostDocument[]>();

  for (const post of _parent.posts ?? []) {
    if (!post.tags?.length) {
      !tags.includes(UNCATEGORIZED_TAG) && tags.push(UNCATEGORIZED_TAG);
      postsByTag.set(UNCATEGORIZED_TAG, [
        ...(postsByTag.get(UNCATEGORIZED_TAG) ?? []),
        post
      ]);
      continue;
    }

    for (const tag of post.tags) {
      !tags.includes(tag) && tags.push(tag);
      postsByTag.set(tag, [...(postsByTag.get(tag) ?? []), post]);
    }
  }

  return {
    tags: tags.sort((a, b) =>
      a._id === UNCATEGORIZED_TAG._id
        ? -1
        : b._id === UNCATEGORIZED_TAG._id
          ? 1
          : a.title.localeCompare(b.title)
    ),
    postsByTag
  };
}) satisfies LayoutLoad;
