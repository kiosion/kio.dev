import { findProjects } from '$stores/work';
import Logger from '$lib/logger';
import type { PageLoad } from './$types';
import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import { redirect } from '@sveltejs/kit';
import type { ResDataMany, ProjectDocument } from '$lib/types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, '/blog/');
  }

  await parent();

  let projectsData: ResDataMany<ProjectDocument> | undefined;

  await findProjects(fetch, {
    limit: PAGINATION_POSTS_PER_PAGE,
    tags: [params.slug]
  })
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      projectsData = res;
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/blog');
    });

  return {
    projects: projectsData
  };
};
