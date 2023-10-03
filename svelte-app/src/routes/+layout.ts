import { DEFAULT_APP_LANG } from '$lib/consts';
import { ENV } from '$lib/env';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';

export const trailingSlash = 'ignore';

export const ssr = ENV !== 'testing';

export const load = (async ({ params, url, fetch }) => {
  const about = await findOne(fetch, 'about', {
    lang: params.lang || DEFAULT_APP_LANG
  }).catch((e: Error) => {
    throw error(500, {
      message: 'Sorry, something went wrong during server-side load.',
      stack: e.stack
    });
  });

  return {
    pathname: url.pathname,
    about
  };
}) satisfies LayoutLoad;
