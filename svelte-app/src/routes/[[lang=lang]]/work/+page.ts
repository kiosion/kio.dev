import {
  DEFAULT_APP_LANG,
  DEFAULT_PROJECT_QUERY_PARAMS,
  RECENT_PROJECTS_COUNT
} from '$lib/consts';
import { find } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    lang = params.lang || DEFAULT_APP_LANG,
    projects = await find(fetch, 'project', {
      ...DEFAULT_PROJECT_QUERY_PARAMS,
      limit: RECENT_PROJECTS_COUNT,
      lang
    });

  if (!parentData.about) {
    throw error(500, {
      message: 'Sorry, something went wrong. Please try again.',
      stack: new Error('Failed to load required data').stack
    });
  }

  return { about: parentData.about, projects };
};
