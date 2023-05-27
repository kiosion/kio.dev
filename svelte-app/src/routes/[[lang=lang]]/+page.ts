import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import Store from '$lib/store';

import type { PageLoad } from './$types';
import type { AuthorDocument } from '$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const about = await Store.findOne<AuthorDocument>(fetch, 'about', {
    lang: params.lang ?? 'en'
  }).catch((err: unknown) => {
    Logger.error(err as string);
    return undefined;
  });

  return { about };
};
