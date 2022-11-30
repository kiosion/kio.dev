import { error, redirect } from '@sveltejs/kit';
import Logger from '$lib/logger';
import {
  PAGINATION_PROJECTS_PER_PAGE,
  DEFAULT_PROJECT_QUERY_PARAMS
} from '$lib/consts';
import Store from '$lib/store';
import type { PageLoad } from './$types';
import type { ResDataMany, ProjectDocument, DocumentTags } from '$types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, params.lang === 'fr' ? '/fr/work/' : '/work/');
  }

  await parent();

  const allTags: ResDataMany<DocumentTags> | undefined =
    await Store.find<DocumentTags>(fetch, 'tag', {
      type: 'project'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  if (
    !allTags?.data?.some(
      (tag) => tag.slug.current === params.slug || tag.title === params.slug
    )
  ) {
    Logger.info('Tag not found', params.slug);
    Logger.info(allTags?.data ?? 'No tags found');
    throw error(404, {
      message: "Sorry, that tag couldn't be found or doesn't exist"
    });
  }

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
