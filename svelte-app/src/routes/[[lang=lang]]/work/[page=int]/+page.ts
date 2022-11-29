import { redirect } from '@sveltejs/kit';
import Logger from '$lib/logger';
import {
  PAGINATION_PROJECTS_PER_PAGE,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '$lib/consts';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, ProjectDocument } from '$types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (parseInt(params.page) < 1) {
    throw redirect(301, '/work/1');
  }

  const skip =
    (parseInt(params?.page || '1') - 1) * PAGINATION_PROJECTS_PER_PAGE;

  await parent();

  const projects: ResDataMany<ProjectDocument> | undefined =
    await Store.find<ProjectDocument>(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: PAGINATION_PROJECTS_PER_PAGE,
      skip
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/work/${params.page}`);
      return undefined;
    });

  return { projects };
};
