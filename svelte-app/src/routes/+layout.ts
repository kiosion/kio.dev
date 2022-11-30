import Logger from '$lib/logger';
import Store from '$lib/store';

export const trailingSlash = 'ignore';

export const load: import('./$types').LayoutLoad = async ({ url, fetch }) => {
  await Store.findConfig(fetch).catch((err: unknown) => {
    Logger.error(`Failed to load config: ${err}`);
  });

  return { url };
};
