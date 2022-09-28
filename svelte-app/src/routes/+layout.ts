import { config, findConfig } from '$stores/config';
import Logger from '$lib/logger';

export const load: import('./$types').LayoutLoad = async ({
  url,
  parent,
  fetch
}) => {
  await parent();

  await findConfig(fetch)
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      config.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/+layout');
    });

  return {
    url
  };
};
