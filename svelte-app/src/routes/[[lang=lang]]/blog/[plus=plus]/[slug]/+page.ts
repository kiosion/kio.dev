import { PAGINATION_POSTS_PER_PAGE } from '$lib/consts';
import Logger from '$lib/logger';
import { find } from '$lib/store';

import { error, redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = async ({ parent, fetch, params }) => {
  if (params.slug === '') {
    throw redirect(301, params.lang === 'fr' ? '/fr/blog/' : '/blog/');
  }

  const _parentData = await parent(),
    allTags = await find(fetch, 'tag', {
      type: 'post',
      limit: 0
    });

  if (
    !allTags?.some(
      (tag) =>
        tag.slug.current?.toLowerCase() === params.slug?.toLowerCase() ||
        tag.title?.toLowerCase() === params.slug?.toLowerCase()
    )
  ) {
    Logger.info('Tag not found', params.slug);
    if (!allTags) {
      Logger.warn('Failed to fetch tags');
    }
    // TODO: Find i18n alternative since linkTo can't work outside client component ctx
    throw error(404, {
      message: "Sorry, that tag couldn't be found or doesn't exist"
    });
  }

  const posts = await find(fetch, 'post', {
    limit: PAGINATION_POSTS_PER_PAGE,
    tags: [params.slug]
  });

  return { posts };
};
