import { DEFAULT_APP_LANG, TORU_API_URL } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import type { ToruData } from '$components/sidebar/toru';
import type { SiteConfig } from '$types';

export const trailingSlash = 'ignore';

export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const toruData = fetch(`${TORU_API_URL}/kiosion?res=json&cover_size=medium`)
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

  const config = (await findOne(fetch, 'config', {
    lang: params.lang || DEFAULT_APP_LANG
  }).catch((e: Error) => {
    Logger.error('Failed to load layout data:', e);
    throw error(500, {
      message: 'Sorry, something went wrong during load.',
      cause: e?.cause,
      stack: e?.stack
    });
  })) as SiteConfig;

  return {
    pathname: url.pathname,
    toruData,
    config
  };
}) satisfies LayoutLoad;
