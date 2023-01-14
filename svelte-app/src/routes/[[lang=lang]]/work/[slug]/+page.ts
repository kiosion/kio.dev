import Logger from '$lib/logger';
import Store from '$lib/store';
import { getHeadings } from '$helpers/pt';
import type {
  ResData,
  ResDataMany,
  ProjectDocument,
  PTBlock,
  Comment
} from '$types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const project: ResData<ProjectDocument> | undefined =
    await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: params.slug
    }).catch((err: unknown) => {
      Logger.error(err as string);
      return undefined;
    });

  const headings = await getHeadings((project?.data.body ?? []) as PTBlock[]);

  const comments = Store.find<Comment>(fetch, 'comment', {
    id: params.slug
  }).catch((err: unknown) => {
    Logger.error(err as string);
    return undefined;
  }) as Promise<ResDataMany<Comment>> | undefined;

  return { project, headings, comments };
};
