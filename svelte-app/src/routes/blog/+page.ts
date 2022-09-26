import { findPosts, findPost } from '$stores/blog';
import { get } from 'svelte/store';
import { config } from '$stores/config';
import Logger from '$lib/logger';
import type { PostDocument, ResData, ResDataMany } from '$lib/types';
import { ENV } from '$lib/env';
import { RECENT_POSTS_COUNT } from '$lib/consts';

export const ssr = !(ENV === 'testing');

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  const currentConfig = get(config);
  let pinnedPost: ResData<PostDocument> | undefined;
  let postsData: ResDataMany<PostDocument> | undefined;

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

  await findPosts(fetch, { limit: RECENT_POSTS_COUNT })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      postsData = res;
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
    });

  return {
    pinned: pinnedPost,
    posts: postsData
  };
};
