import { getHeadings } from '$helpers/pt';
import Logger from '$lib/logger';
import Store from '$lib/store';

import type { PageLoad } from './$types';
import type { ProjectDocument, PTBlock, ResData } from '$types';

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

  const headings = await getHeadings((project?.data.body ?? []) as PTBlock[]);

  return { project, headings };
};
