import { DEFAULT_APP_LANG, HOMEPAGE_POSTS_NUM } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { find, findOne } from '$lib/store';

import type { PageLoad } from './$types';
import type { AuthorDocument, PostDocument, ProjectDocument } from '$types';

export const load = (async ({ parent, fetch, params }) => {
  const lang = params.lang || DEFAULT_APP_LANG,
    promises = [
      parent().then((data) => data.about),
      find(fetch, 'post', { limit: HOMEPAGE_POSTS_NUM, lang }),
      findOne(fetch, 'project', { id: 'kio.dev', lang })
    ];

  const [about, posts, project] = handleLoadError(await Promise.all(promises)) as [
    AuthorDocument,
    PostDocument[],
    ProjectDocument
  ];

  return { posts, projects: [project], about };
}) satisfies PageLoad;
