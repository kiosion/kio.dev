import { DEFAULT_PROJECT_QUERY_PARAMS, RECENT_PROJECTS_COUNT } from '$lib/consts';
import { find, findOne } from '$lib/store';

import type { PageLoad } from './$types';
import type { AuthorDocument, ProjectDocument } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    aboutData = parentData.author,
    currentConfig = parentData.config;

  const promiseArray = [];

  if (!aboutData) {
    promiseArray.push(
      findOne(fetch, 'about', {
        lang: params.lang ?? 'en'
      })
    );
  } else {
    promiseArray.push(Promise.resolve(aboutData));
  }

  promiseArray.push(
    find(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: RECENT_PROJECTS_COUNT,
      lang: params.lang ?? 'en'
    })
  );

  if (currentConfig?.pinnedProject?._ref) {
    promiseArray.push(
      findOne(fetch, 'project', {
        id: currentConfig.pinnedProject._ref,
        lang: params.lang ?? 'en'
      })
    );
  }

  const [about, projects, pinned] = (await Promise.all(promiseArray)) as [
    AuthorDocument | undefined,
    ProjectDocument[] | undefined,
    ProjectDocument | undefined
  ];

  return { about, pinned, projects };
};
