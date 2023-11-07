import { DEFAULT_APP_LANG } from '$lib/consts';
import { ENV } from '$lib/env';
import Logger from '$lib/logger';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import type { AuthorDocument, SiteConfig } from '$types';

export const trailingSlash = 'ignore';

export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const [about, config] = (await Promise.all([
    findOne(fetch, 'about', { lang: params.lang || DEFAULT_APP_LANG }),
    findOne(fetch, 'config')
  ]).catch((e: Error) => {
    Logger.error('Failed to load layout data:', e);
    throw error(500, {
      message: 'Sorry, something went wrong during load.',
      stack: e.stack
    });
  })) as [AuthorDocument, SiteConfig];

  return {
    pathname: url.pathname,
    about,
    config
  };
}) satisfies LayoutLoad;
