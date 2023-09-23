import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = ({ params }) => {
  throw redirect(301, params.lang === 'fr' ? '/fr/blog' : '/blog');
};
