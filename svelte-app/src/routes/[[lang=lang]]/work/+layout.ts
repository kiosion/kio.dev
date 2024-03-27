import { DEFAULT_APP_LANG, DEFAULT_PROJECT_QUERY_PARAMS } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { find } from '$lib/store';

import type { LayoutLoad } from './$types';
import type { ProjectDocument, SiteConfig } from '$types';

export const load = (async ({ parent, fetch, params }) => {
  const configPromise = parent().then((data) => data.config),
    promises = [
      configPromise,
      find(fetch, 'project', {
        ...DEFAULT_PROJECT_QUERY_PARAMS,
        lang: params.lang || DEFAULT_APP_LANG
      })
    ],
    [config, projects] = handleLoadError(await Promise.all(promises)) as [
      SiteConfig,
      ProjectDocument[]
    ];

  return { config, projects };
}) satisfies LayoutLoad;
