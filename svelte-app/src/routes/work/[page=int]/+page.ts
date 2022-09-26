import { findProjects } from '$stores/work';
import Logger from '$lib/logger';
import type { PageLoad } from './$types';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import { redirect } from '@sveltejs/kit';
import type { ResDataMany, ProjectDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (parseInt(params.page) < 1) {
    throw redirect(301, '/work/1');
  }

  const skip = (parseInt(params?.page || '1') - 1) * PAGINATION_POSTS_PER_PAGE;

  await parent();

  let projectsData: ResDataMany<ProjectDocument> | undefined;

  await findProjects(fetch, { skip, limit: skip + PAGINATION_POSTS_PER_PAGE })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      projectsData = res;
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/work');
    });

  return {
    projects: projectsData
  };
};
