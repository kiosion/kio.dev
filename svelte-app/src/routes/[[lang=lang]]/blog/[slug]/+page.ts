import { findOne } from '$lib/store';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  await parent();

  const post = await findOne(fetch, 'post', {
    idb: btoa(params.slug),
    lang: params.lang ?? 'en'
  }).catch((_e: Error) => {
    throw error(500, {
      message: 'Sorry, something went wrong loading that post.'
    });
  });

  if (!post) {
    throw error(404, {
      message: "Sorry, that post couldn't be found or doesn't exist"
    });
  }

  return { post, routeFetch: fetch };
};
