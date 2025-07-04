import { get } from 'svelte/store';

import { api, unwrap } from '$lib/api/client';
import { TORU_API_URL } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';

import { data as toruDataStore } from '$components/sidebar/toru';

import type { LayoutLoad } from './$types';
import type { ToruData } from '$components/sidebar/toru';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const config = unwrap(await api.getConfig(fetch, { lang: params.lang }));

  const toruData = (
    config.enableToru && !get(toruDataStore)
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
