import { DEFAULT_APP_LANG, HOMEPAGE_POSTS_NUM } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { find } from '$lib/store';

import type { PageLoad } from './$types';
import type { PostDocument, SiteConfig } from '$types';

export const load = (async ({ parent, fetch, params }) => {
  const lang = params.lang || DEFAULT_APP_LANG,
    promises = [
      parent().then((data) => data.config),
      find(fetch, 'post', { limit: HOMEPAGE_POSTS_NUM, lang })
    ];

  const [config, posts] = handleLoadError(await Promise.all(promises)) as [
    SiteConfig,
    PostDocument[]
  ];

  return { posts, config };
}) satisfies PageLoad;
