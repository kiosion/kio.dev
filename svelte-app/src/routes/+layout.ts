import Logger from '$lib/logger';
import Store from '$lib/store';

export const load: import('./$types').LayoutLoad = async ({
  url,
  parent,
  fetch
}) => {
  await parent();

  await Store.findConfig(fetch)
    .then(() => {
      Logger.info('Config loaded', 'routes/+layout');
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/+layout');
    });

  return { url };
};
