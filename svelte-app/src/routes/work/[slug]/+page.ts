import Logger from '$lib/logger';
import Store from '$lib/store';
import type { ResData, ProjectDocument } from '$lib/types';

export const load: import('./$types').PageLoad = async ({
  parent,
  fetch,
  params
}) => {
  await parent();

  const project: ResData<ProjectDocument> | undefined =
    await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: params.slug
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/work/${params.slug}`);
      return undefined;
    });

  return { project };
};
