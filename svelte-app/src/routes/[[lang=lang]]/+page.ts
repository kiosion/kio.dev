import { find, findOne } from '$lib/store';

import type { PageLoad } from './$types';
import type { AuthorDocument, PostDocument, ProjectDocument } from '$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent();

  const promiseArray = [];

  promiseArray.push(
    find(fetch, 'post', {
      limit: 6,
      lang: params.lang ?? 'en'
    }),
    findOne(fetch, 'project', {
      id: 'kio.dev',
      lang: params.lang ?? 'en'
    })
  );

  promiseArray.push(
    parentData.author
      ? Promise.resolve(parentData.author)
      : findOne(fetch, 'about', {
          lang: params.lang ?? 'en'
        })
  );

  const [posts, project, about] = (await Promise.all(promiseArray)) as [
    PostDocument[],
    ProjectDocument,
    AuthorDocument
  ];

  return { posts, projects: [project], about };
};
