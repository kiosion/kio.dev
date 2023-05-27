import { get } from 'svelte/store';

import { linkTo } from '$i18n';

import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (({ params }) => {
  let redir = '/';

  if (params.lang) {
    redir = get(linkTo)('/', params.lang);
  }

  throw redirect(301, redir);
}) satisfies PageLoad;
