import Logger from '$lib/logger';
import {
  RECENT_PROJECTS_COUNT,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '$lib/consts';
import { config } from '$stores/config';
import { get } from 'svelte/store';
import Store from '$lib/store';
import type { ProjectDocument, ResData, ResDataMany } from '$types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
  await parent();

  const currentConfig = get(config);

  let pinned: ResData<ProjectDocument> | undefined;

  if (currentConfig?.data?.pinnedProject?._ref) {
    pinned = await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: currentConfig.data.pinnedProject._ref
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });
  }

  const projects: ResDataMany<ProjectDocument> | undefined =
    await Store.find<ProjectDocument>(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: RECENT_PROJECTS_COUNT
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  return { pinned, projects };
};
