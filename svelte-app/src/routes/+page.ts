import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();

  return { posts: parentData.posts, config: parentData.config };
}) satisfies PageLoad;
