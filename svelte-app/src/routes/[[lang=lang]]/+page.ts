import { ENV } from '$lib/env';

export const ssr = !(ENV === 'testing');
export const prerender = true;
