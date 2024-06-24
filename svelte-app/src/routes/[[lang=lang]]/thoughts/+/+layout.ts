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
    tagCounts: Record<DocumentTags['_id'], number> = {},
    postsByTag: Record<DocumentTags['_id'], PostDocument[]> = {};

  for (const post of _parent.posts ?? []) {
    if (!post.tags?.length) {
      if (!(UNCATEGORIZED_TAG._id in tagCounts)) {
        tags.push(UNCATEGORIZED_TAG);
      }
      tagCounts[UNCATEGORIZED_TAG._id] = (tagCounts[UNCATEGORIZED_TAG._id] ?? 0) + 1;
      postsByTag[UNCATEGORIZED_TAG._id] = [
        ...(postsByTag[UNCATEGORIZED_TAG._id] ?? []),
        post
      ];
      continue;
    }

    for (const tag of post.tags) {
      if (!(tag._id in tagCounts)) {
        tags.push(tag);
      }
      tagCounts[tag._id] = (tagCounts[tag._id] ?? 0) + 1;
      postsByTag[tag._id] = [...(postsByTag[tag._id] ?? []), post];
    }
  }

  // in-place insertion sort by count, title
  for (let i = 1; i < tags.length; i++) {
    const currentTag = tags[i],
      currentCount = tagCounts[currentTag._id];

    let j = i - 1;

    while (
      j >= 0 &&
      ((tags[j]._id === UNCATEGORIZED_TAG._id ? -1 : 0) ||
        tagCounts[tags[j]._id] < currentCount ||
        (tagCounts[tags[j]._id] === currentCount &&
          tags[j].title.localeCompare(currentTag.title) > 0))
    ) {
      tags[j + 1] = tags[j];
      j--;
    }

    tags[j + 1] = currentTag;
  }

  return {
    tags,
    postsByTag
  };
}) satisfies LayoutLoad;
