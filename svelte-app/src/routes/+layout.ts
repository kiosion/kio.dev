import type { ToruData } from '$components/sidebar/toru';
import { unwrapAPIResponse } from '$lib/api/result';
import { findOne } from '$lib/api/store';
import { DEFAULT_APP_LANG, TORU_API_URL } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const config = unwrapAPIResponse(
    await findOne(fetch, 'config', { lang: params.lang || DEFAULT_APP_LANG })
  );

  const toruData = (
    config.enableToru
      ? (fetch(`${TORU_API_URL}/kiosion?res=json&cover_size=medium`)
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
          }) as Promise<ToruData | undefined>)
      : Promise.resolve(undefined)
  ) satisfies Promise<ToruData | undefined>;

  return {
    pathname: url.pathname,
    toruData,
    config
  };
}) satisfies LayoutLoad;
