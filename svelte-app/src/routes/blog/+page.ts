import { posts, findPosts, findPost } from '$stores/blog';
import { get } from 'svelte/store';
import { config } from '$stores/config';
import Logger from '$lib/logger';
import type { PostDocument, ResData } from '$lib/types';

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  const currentConfig = get(config);
  let pinnedPost: ResData<PostDocument> | undefined;

  if (currentConfig?.data?.pinnedPost?._ref) {
    await findPost(fetch, { id: currentConfig.data.pinnedPost._ref })
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        pinnedPost = res;
      })
      .catch((err: Error) => {
        Logger.error(err as unknown as string, 'routes/blog');
      });
  }

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
    pinnedPost
  };
};
