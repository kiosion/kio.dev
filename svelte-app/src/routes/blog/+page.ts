import { posts, findPosts } from '@/stores/posts';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  await findPosts(fetch, { limit: 6 })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      return posts.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/index');
    });
};
