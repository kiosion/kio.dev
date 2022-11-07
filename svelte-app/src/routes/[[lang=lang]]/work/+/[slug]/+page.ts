import { redirect } from '@sveltejs/kit';
import Logger from '$lib/logger';
import {
  PAGINATION_PROJECTS_PER_PAGE,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '$lib/consts';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, ProjectDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  // TODO: Check if this is a valid tag or not before querying!

  const projects: ResDataMany<ProjectDocument> | undefined =
    await Store.find<ProjectDocument>(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: PAGINATION_PROJECTS_PER_PAGE,
      tags: [params.slug]
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/work/+/${params.slug}`);
      return undefined;
    });

  return { projects };
};
