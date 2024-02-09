import { DEFAULT_APP_LANG } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import type { SiteConfig } from '$types';

export const trailingSlash = 'ignore';

export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
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
    config
  };
}) satisfies LayoutLoad;
