import { DEFAULT_APP_LANG } from '$lib/consts';
import { find, findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import type { PostDocument, ProjectDocument } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    about = parentData.about,
    lang = params.lang || DEFAULT_APP_LANG,
    promiseArray = [
      find(fetch, 'post', { limit: 6, lang }),
      findOne(fetch, 'project', { id: 'kio.dev', lang })
    ];

  if (!about) {
    throw error(500, {
      message: 'Sorry, something went wrong. Please try again.',
      stack: new Error('Failed to load required data').stack
    });
  }

  const [posts, project] = (await Promise.all(promiseArray)) as [
    PostDocument[],
    ProjectDocument
  ];

  return { posts, projects: [project], about };
};
