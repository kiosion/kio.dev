import { DEFAULT_PROJECT_QUERY_PARAMS, PAGINATION_PROJECTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import { find } from '$lib/store';

import { error, redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const prerender = false;

export const load = (async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, params.lang === 'fr' ? '/fr/work/' : '/work/');
  }

  await parent();

  const allTags = await find(fetch, 'tag', {
    type: 'project',
    limit: 0
  }).catch((err: unknown) => {
    Logger.error(err as string);
    return undefined;
  });

  if (
    !allTags?.some(
      (tag) =>
        tag.slug.current?.toLowerCase() === params.slug?.toLowerCase() ||
        tag.title?.toLowerCase() === params.slug?.toLowerCase()
    )
  ) {
    Logger.info('Tag not found', {}, params.slug);
    if (!allTags) {
      console.warn('Failed to fetch tags');
    }
    throw error(404, {
      message: "Sorry, that tag couldn't be found or doesn't exist"
    });
  }

  const projects = await find(fetch, 'project', {
    ...DEFAULT_PROJECT_QUERY_PARAMS,
    limit: PAGINATION_PROJECTS_PER_PAGE,
    tags: [params.slug]
  }).catch((err: unknown) => {
    Logger.error(err as string, {}, `routes/work/+/${params.slug}`);
    return undefined;
  });

  return { projects };
}) satisfies PageLoad;
