import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
  const _parent = await parent(),
    tag = _parent.tags.find((tag) => tag.slug.current === params.slug);

  if (!tag) {
    throw error(404, 'Not found');
  }

  return { posts: _parent.postsByTag[tag._id], tag };
}) satisfies PageLoad;
