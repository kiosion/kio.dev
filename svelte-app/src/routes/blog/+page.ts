import { posts, findPosts, findPost } from '@/stores/posts';
import { config } from '@/stores/config';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  let pinnedPost: Document | undefined;

  const unsubscribe = config.subscribe(async (res) => {
    if (res.data?.pinnedPost?._ref) {
      await findPost(fetch, { id: res.data.pinnedPost._ref })
        .then((res) => {
          if (res.error) {
            throw res.error;
          }
          pinnedPost = res;
          // console.log('got pinned post!', res);
        })
        .catch((err) => {
          Logger.error(err as string, 'routes/blog');
        });
    }
  });

  await findPosts(fetch, { limit: 6 })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      return posts.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
    });

  return {
    pinnedPost,
    unsubscribe
  };
};
