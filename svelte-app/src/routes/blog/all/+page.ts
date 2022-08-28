import { posts, findPosts } from '@/stores/blog';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  // TODO: Handle pagination (via query params / subroutes)

  await findPosts(fetch, { limit: 12 })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      return posts.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
    });
};
