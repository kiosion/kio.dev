import { about, findAbout } from '$stores/about';
import { config } from '$stores/config';
import Logger from '$lib/logger';

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

  const unsubscribe = config.subscribe(async (res) => {
    if (res.data?.me?._ref) {
      // Query author obj
    }
  });

  await findAbout(fetch)
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      about.set(res);
    })
    .catch((err: unknown) => {
      Logger.error(err as string, 'routes/about');
    });

  return {
    unsubscribe
  };
};
