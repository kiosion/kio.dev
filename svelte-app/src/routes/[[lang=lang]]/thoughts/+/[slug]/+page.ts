import { ENV } from '$lib/env';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (({ params }) => {
  if (ENV !== 'production') {
    throw error(404, 'Not found');
  }

  return { slug: params.slug };
}) satisfies PageLoad;
