import Logger from '$lib/logger';
import Store from '$lib/store';
import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';

export const load: LayoutLoad = async ({ url, fetch }) => {
  await Store.findConfig(fetch).catch((err: unknown) => {
    Logger.error(`Failed to load config: ${err}`);
  });

  return { url };
};
