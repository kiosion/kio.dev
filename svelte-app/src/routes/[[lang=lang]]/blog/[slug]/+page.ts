import { DEFAULT_APP_LANG } from '$lib/consts';
import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params, url }) => {
  const _parentData = await parent(),
    lang = params.lang || DEFAULT_APP_LANG,
    preview = url.searchParams.get('preview') === 'true' || false,
    post = await findOne(fetch, 'post', { idb: btoa(params.slug), lang, preview }).catch(
      (e: Error) => {
        throw error(500, {
          message: 'Sorry, something went wrong loading that post.',
          stack: e.stack
        });
      }
    );

  if (!post) {
    throw error(404, {
      message: "Sorry, that post couldn't be found or doesn't exist"
    });
  }

  return { post, routeFetch: fetch };
};
