import { about, findAbout } from '$stores/about';
import Logger from '$lib/logger';
import { ENV } from '$lib/env';

export const ssr = !(ENV === 'testing');

export const load: import('./$types').PageLoad = async ({ parent, fetch }) => {
  await parent();

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
};
