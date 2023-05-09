import { get } from 'svelte/store';
import { config } from '$stores/config';
import Logger from '$lib/logger';
import { ENV } from '$lib/env';
import { RECENT_POSTS_COUNT } from '$lib/consts';
import Store from '$lib/store';
import type { PostDocument, ResData, ResDataMany } from '$types';
import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const currentConfig = get(config)?.data;

  let pinned: ResData<PostDocument> | undefined;

  if (currentConfig?.pinnedPost?._ref) {
    pinned = await Store.findOne<PostDocument>(fetch, 'post', {
      id: currentConfig.pinnedPost._ref,
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });
  }

  const posts: ResDataMany<PostDocument> | undefined =
    await Store.find<PostDocument>(fetch, 'post', {
      limit: RECENT_POSTS_COUNT,
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  return { pinned, posts };
};
