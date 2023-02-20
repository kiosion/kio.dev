import Logger from '$lib/logger';
import { ENV } from '$lib/env';
import Store from '$lib/store';
import type { AuthorDocument } from '$types';
import type { PageLoad } from './$types';

export const ssr = !(ENV === 'testing');

export const load: PageLoad = async ({ parent, fetch }) => {
  await parent();

  const about = await Store.findOne<AuthorDocument>(fetch, 'about').catch(
    (err: unknown) => {
      Logger.error(err as string);
      return undefined;
    }
  );

  return { about };
};