import { redirect } from '@sveltejs/kit';
import { linkTo } from '$i18n';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  let redir = '/';

  if (params.lang) {
    redir = linkTo('/', params.lang);
  }

  throw redirect(301, redir);
}) satisfies PageLoad;
