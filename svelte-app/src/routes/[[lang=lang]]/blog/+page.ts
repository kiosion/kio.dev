import { RECENT_POSTS_COUNT } from '$lib/consts';
import { ENV } from '$lib/env';
import { find, findOne } from '$lib/store';

import type { PageLoad } from './$types';
import type { PostDocument } from '$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    currentConfig = parentData.config;

  const promiseArray = [];

  promiseArray.push(
    find(fetch, 'post', {
      limit: RECENT_POSTS_COUNT,
      lang: params.lang ?? 'en'
    })
  );

  if (currentConfig?.pinnedPost?._ref) {
    promiseArray.push(
      findOne(fetch, 'post', {
        id: currentConfig.pinnedPost._ref,
        lang: params.lang ?? 'en'
      })
    );
  }

  const [posts, pinned] = (await Promise.all(promiseArray)) as [
    PostDocument[] | undefined,
    PostDocument | undefined
  ];

  return { posts, pinned };
};
