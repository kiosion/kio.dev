import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();

  if (!parentData.about) {
    throw error(500, {
      message: 'Sorry, something went wrong. Please try again.',
      stack: new Error('Failed to load required data').stack
    });
  }

  return { about: parentData.about };
}) satisfies PageLoad;
