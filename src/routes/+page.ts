import { error } from '@sveltejs/kit';
import { loadAboutContent } from '$lib/content';

import type { PageLoad } from './$types';

export const load = (async () => {
  const content = await loadAboutContent();

  if (!content) {
    throw error(500, 'Failed to load content');
  }

  return { content };
}) satisfies PageLoad;
