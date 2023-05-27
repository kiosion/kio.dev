import ToruSync from '$helpers/toru';
import Logger from '$lib/logger';
import Store from '$lib/store';

import type { LayoutLoad } from './$types';
import type { AuthorDocument } from '$types';

export const trailingSlash = 'ignore';

export const load = (async ({ url, fetch }) => {
  ToruSync.start(fetch);

  const promises = await Promise.all([
    Store.findOne<AuthorDocument>(fetch, 'about')
      .then((res) => res?.data)
      .catch((err: unknown) => {
        Logger.error(err as string);
        return undefined;
      }),
    Store.findConfig(fetch).catch((err: unknown) => {
      Logger.error(`Failed to load config: ${err}`);
    })
  ]);

  return { url, author: promises[0] };
}) satisfies LayoutLoad;
