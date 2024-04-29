import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import type { DocumentTags, PostDocument } from '$types';

export const load = (async ({ parent, params }) => {
  const _parent = await parent(),
    posts: PostDocument[] = [];

  let tag: DocumentTags | undefined;

  for (let i = 0; i < _parent.posts.length; ++i) {
    if (!_parent.posts[i].tags) {
      continue;
    }

    for (let j = 0; j < _parent.posts[i].tags!.length; ++j) {
      if (_parent.posts[i].tags![j].slug.current !== params.slug) {
        continue;
      }

      tag ??= _parent.posts[i].tags![j];
      posts.push(_parent.posts[i]);
    }
  }

  if (!tag) {
    throw error(404, 'Not found');
  }

  return { posts, tag };
}) satisfies PageLoad;
