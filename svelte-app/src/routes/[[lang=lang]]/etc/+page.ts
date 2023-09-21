import { findOne } from '$lib/store';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const parentData = await parent(),
    about =
      parentData.author ??
      (await findOne(fetch, 'about', {
        lang: params.lang ?? 'en'
      }));

  return { about };
};
