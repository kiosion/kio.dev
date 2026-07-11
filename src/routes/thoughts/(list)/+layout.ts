import { error } from '@sveltejs/kit';
import { loadThoughtsContent } from '$lib/content';

import type { LayoutLoad } from './$types';

// Universal (not server) load: the content carries a Svelte component, which
// isn't serializable, so it must be resolved here rather than in a +*.server.ts.
export const load = (async () => {
  const content = await loadThoughtsContent();

  if (!content) {
    throw error(500, 'Failed to load content');
  }

  return { content };
}) satisfies LayoutLoad;
