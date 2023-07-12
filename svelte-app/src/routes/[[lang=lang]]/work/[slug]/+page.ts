import { getHeadings } from '$helpers/pt';
import Logger from '$lib/logger';
import Store from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import type { ProjectDocument, ResData } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const project: ResData<ProjectDocument> | undefined =
    await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: params.slug,
      lang: params.lang ?? 'en'
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  if (!project) {
    throw error(404, {
      message: "Sorry, that project couldn't be found or doesn't exist"
    });
  }

  const headings = getHeadings(project?.data.body ?? []);

  return { project, headings };
};
