import { error } from '@sveltejs/kit';
import { loadEtcContent } from '$lib/content';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();
  const content = await loadEtcContent();

  if (!content) {
    throw error(500, 'Failed to load content');
  }

  return {
    breadcrumbs: [...parentData.breadcrumbs, { label: content.title, href: '/etc' }],
    content,
  };
}) satisfies PageLoad;
