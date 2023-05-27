import { get } from 'svelte/store';

import { DEFAULT_PROJECT_QUERY_PARAMS, RECENT_PROJECTS_COUNT } from '$lib/consts';
import Logger from '$lib/logger';
import Store from '$lib/store';
import { config } from '$stores/config';

import type { PageLoad } from './$types';
import type { AuthorDocument, ProjectDocument, ResData, ResDataMany } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const currentConfig = get(config);

  let pinned: ResData<ProjectDocument> | undefined;

  if (currentConfig?.data?.pinnedProject?._ref) {
    pinned = await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: currentConfig.data.pinnedProject._ref,
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });
  }

  const about = await Store.findOne<AuthorDocument>(fetch, 'about').catch(
    (err: unknown) => {
      Logger.error(err as string);
      return undefined;
    }
  );

  const projects: ResDataMany<ProjectDocument> | undefined =
    await Store.find<ProjectDocument>(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: RECENT_PROJECTS_COUNT,
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  return { about, pinned, projects };
};
