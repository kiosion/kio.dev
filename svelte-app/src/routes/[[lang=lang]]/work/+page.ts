import { DEFAULT_APP_LANG, DEFAULT_PROJECT_QUERY_PARAMS } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { find } from '$lib/store';

import type { PageLoad } from './$types';
import type { AuthorDocument, ProjectDocument } from '$types';

export const load = (async ({ parent, fetch, params }) => {
  const aboutPromise = parent().then((data) => data.about),
    promises = [
      aboutPromise,
      find(fetch, 'project', {
        ...DEFAULT_PROJECT_QUERY_PARAMS,
        lang: params.lang || DEFAULT_APP_LANG
      })
    ],
    [about, projects] = handleLoadError(await Promise.all(promises)) as [
      AuthorDocument,
      ProjectDocument[]
    ];

  return { about, projects };
}) satisfies PageLoad;
