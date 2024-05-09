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
    postsByTag: Record<DocumentTags['_id'], PostDocument[]> = {};

  for (const post of _parent.posts ?? []) {
    if (!post.tags?.length) {
      !tags.some((tag) => tag._id === UNCATEGORIZED_TAG._id) &&
        tags.push(UNCATEGORIZED_TAG);

      postsByTag[UNCATEGORIZED_TAG._id] = [
        ...(postsByTag[UNCATEGORIZED_TAG._id] ?? []),
        post
      ];
      continue;
    }

    for (const tag of post.tags) {
      !tags.some((t) => t._id === tag._id) && tags.push(tag);
      postsByTag[tag._id] = [...(postsByTag[tag._id] ?? []), post];
    }
  }

  return {
    tags: tags.sort((a, b) =>
      a._id === UNCATEGORIZED_TAG._id
        ? -1
        : b._id === UNCATEGORIZED_TAG._id
          ? 1
          : postsByTag[b._id].length - postsByTag[a._id].length
    ),
    postsByTag
  };
}) satisfies LayoutLoad;
