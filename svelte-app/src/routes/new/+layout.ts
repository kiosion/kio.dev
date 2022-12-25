import { ENV } from '$lib/env';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
  if (ENV === 'production') {
    throw error(401, 'This route is not available in production.');
  }

  return { url };
};
