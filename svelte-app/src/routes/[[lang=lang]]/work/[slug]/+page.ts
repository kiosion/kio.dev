import { DEFAULT_APP_LANG } from '$lib/consts';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, url }) => {
  const lang = params.lang || DEFAULT_APP_LANG,
    preview = url.searchParams.get('preview') === 'true' || false,
    project = await findOne(fetch, 'project', { id: params.slug, lang, preview }).catch(
      (e: Error) => {
        throw error(500, {
          message: 'Sorry, something went wrong loading that project.',
          stack: e.stack
        });
      }
    );

  if (!project) {
    throw error(404, {
      message: "Sorry, that project couldn't be found or doesn't exist"
    });
  }

  return { project, routeFetch: fetch };
}) satisfies PageLoad;
