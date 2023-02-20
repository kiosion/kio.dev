import Logger from '$lib/logger';
import Store from '$lib/store';
import ToruSync from '$helpers/toru';
import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';

export const load = (async ({ url, fetch }) => {
  ToruSync.start(fetch);

  await Store.findConfig(fetch).catch((err: unknown) => {
    Logger.error(`Failed to load config: ${err}`);
  });

  return { url };
}) satisfies LayoutLoad;
