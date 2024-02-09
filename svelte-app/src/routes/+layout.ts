import { DEFAULT_APP_LANG } from '$lib/consts';
import { handleLoadError } from '$lib/data';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import type { LayoutLoad } from './$types';
import type { SiteConfig } from '$types';

export const trailingSlash = 'ignore';

export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const config = handleLoadError(
    await findOne(fetch, 'config', {
      lang: params.lang || DEFAULT_APP_LANG
    }).catch((e: Error) => {
      Logger.error('Failed to load layout data:', e);
      throw new Error('Sorry, something went wrong during load.', {
        cause: e?.cause,
        stack: e?.stack
      });
    })
  ) satisfies SiteConfig;

  return {
    pathname: url.pathname,
    config
  };
}) satisfies LayoutLoad;
