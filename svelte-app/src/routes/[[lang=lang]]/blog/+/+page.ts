import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = () => {
  throw redirect(301, '/blog');
};
