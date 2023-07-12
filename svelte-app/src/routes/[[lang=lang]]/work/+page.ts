import { get } from 'svelte/store';

import { DEFAULT_PROJECT_QUERY_PARAMS, RECENT_PROJECTS_COUNT } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import { config } from '$stores/config';

import type { PageLoad } from './$types';
import type { AuthorDocument, ProjectDocument } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    aboutData = parentData?.author,
    currentConfig = parentData?.config?.data ?? get(config)?.data;

  const promiseArray = [];

  if (!aboutData) {
    promiseArray.push(
      Store.findOne<AuthorDocument>(fetch, 'about', {
        lang: params.lang ?? 'en'
      })
        .then((res) => res?.data)
        .catch((err: unknown) => {
          Logger.error(err as string);
          return undefined;
        })
    );
  } else {
    promiseArray.push(Promise.resolve(aboutData));
  }

  promiseArray.push(
    Store.find<ProjectDocument>(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: RECENT_PROJECTS_COUNT,
      lang: params.lang ?? 'en'
    })
      .then((res) => res?.data)
      .catch((err: unknown) => {
        Logger.error(err as string);
        return undefined;
      })
  );

  if (currentConfig?.pinnedProject?._ref) {
    promiseArray.push(
      Store.findOne<ProjectDocument>(fetch, 'project', {
        id: currentConfig.pinnedProject._ref,
        lang: params.lang ?? 'en'
      })
        .then((res) => res?.data)
        .catch((err: unknown) => {
          Logger.error(err as string);
          return undefined;
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
