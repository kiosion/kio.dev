import { get } from 'svelte/store';
import { config } from '$stores/config';
import Logger from '$lib/logger';
import { ENV } from '$lib/env';
import { RECENT_POSTS_COUNT } from '$lib/consts';
import Store from '$lib/store';
import type { PostDocument, ResData, ResDataMany } from '$types';

export const ssr = !(ENV === 'testing');

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  const currentConfig = get(config);

  let pinned: ResData<PostDocument> | undefined;

  if (currentConfig?.data?.pinnedPost?._ref) {
    pinned = await Store.findOne<PostDocument>(fetch, 'post', {
      id: currentConfig.data.pinnedPost._ref
    }).catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
      return undefined;
    });
  }

  const posts: ResDataMany<PostDocument> | undefined =
    await Store.find<PostDocument>(fetch, 'post', {
      limit: RECENT_POSTS_COUNT
    }).catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
      return undefined;
    });

  return { pinned, posts };
};
