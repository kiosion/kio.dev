import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params, url }) => {
  await parent();

  const preview = !!url.searchParams.get('preview') || false;

  const project = await findOne(fetch, 'project', {
    id: params.slug,
    lang: params.lang ?? 'en',
    preview
  }).catch((err: unknown) => {
    Logger.error(err as string);
    return undefined;
  });

  if (!project) {
    throw error(404, {
      message: "Sorry, that project couldn't be found or doesn't exist"
    });
  }

  return { project };
};
