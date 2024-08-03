import { TORU_API_URL } from '$lib/consts';
import Logger from '$lib/logger';

import type { PageLoad } from './$types';
import type { ToruData } from '$components/sidebar/toru';

export const load = (({ fetch }) => {
  const nowPlayingData = fetch(`${TORU_API_URL}/kiosion?res=json&cover_size=medium`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch now playing data');
      }

      return res
        .json()
        .then((data) => data.data)
        .catch((e) => {
          throw new Error('Failed to parse now playing data', e);
        });
    })
    .catch((e) => {
      Logger.error(e);

      return undefined;
    }) satisfies Promise<ToruData | undefined>;

  return { fetch, nowPlayingData };
}) satisfies PageLoad;
