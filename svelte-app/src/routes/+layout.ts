import Logger from '$lib/logger';
import Store from '$lib/store';

// Ignore trailing slashes for all routes
export const trailingSlash = 'ignore';

export const load: import('./$types').LayoutLoad = async ({ url, fetch }) => {
  await Store.findConfig(fetch)
    .then(() => {
      Logger.info('Config loaded', 'routes/+layout');
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/+layout');
    });

  return { url };
};
