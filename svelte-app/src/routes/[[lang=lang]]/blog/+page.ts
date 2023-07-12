import { get } from 'svelte/store';

import { RECENT_POSTS_COUNT } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';
import { config } from '$stores/config';

import type { PageLoad } from './$types';
import type { PostDocument } from '$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    currentConfig = parentData?.config?.data ?? get(config)?.data;

  const promiseArray = [];

  promiseArray.push(
    Store.find<PostDocument>(fetch, 'post', {
      limit: RECENT_POSTS_COUNT,
      lang: params.lang ?? 'en'
    })
      .then((res) => res?.data)
      .catch((err: unknown) => {
        Logger.error(err as string);
        return undefined;
      })
  );

  if (currentConfig?.pinnedPost?._ref) {
    promiseArray.push(
      Store.findOne<PostDocument>(fetch, 'post', {
        id: currentConfig.pinnedPost._ref,
        lang: params.lang ?? 'en'
      })
        .then((res) => res?.data)
        .catch((err: unknown) => {
          Logger.error(err as string);
          return undefined;
        })
    );
  }

  const [posts, pinned] = (await Promise.all(promiseArray)) as [
    PostDocument[],
    PostDocument | undefined
  ];

  return { posts, pinned };
};
