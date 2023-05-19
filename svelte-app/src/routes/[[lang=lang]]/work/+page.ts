import Logger from '$lib/logger';
import {
  RECENT_PROJECTS_COUNT,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '$lib/consts';
import { config } from '$stores/config';
import { get } from 'svelte/store';
import Store from '$lib/store';
import type {
  AuthorDocument,
  ProjectDocument,
  ResData,
  ResDataMany
} from '$types';
import type { PageLoad } from './$types';

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
