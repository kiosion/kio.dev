import Logger from '$lib/logger';
import Store from '$lib/store';
import type { ResData, ProjectDocument } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const project: ResData<ProjectDocument> | undefined =
    await Store.findOne<ProjectDocument>(fetch, 'project', {
      id: params.slug
    }).catch((err: unknown) => {
      Logger.error(err as string, `routes/work/${params.slug}`);
      return undefined;
    });

  const headings =
    (await (
      await fetch('/api/get/parsedPt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project?.data.body ?? [])
      })
    )?.json()) ?? [];

  return { project, headings };
};
