import { BASE_DOMAIN, HOMEPAGE_POSTS_NUM } from '$lib/consts';
import { ENV } from '$lib/env';
import { getPageMeta } from '$lib/nav.svelte';
import { getAllPosts } from '$lib/posts';
import { siteConfig } from '$lib/site-config';

import type { LayoutServerLoad } from './$types';

export const trailingSlash = 'ignore';
export const ssr = ENV !== 'testing';
export const prerender = true;

export const load = (({ url, setHeaders }) => {
  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
  });

  const recentPosts = getAllPosts().slice(0, HOMEPAGE_POSTS_NUM);

  return {
    breadcrumbs: [{ label: BASE_DOMAIN, href: '/' }],
    meta: getPageMeta(url.pathname),
    pathname: url.pathname,
    siteConfig,
    posts: recentPosts,
  };
}) satisfies LayoutServerLoad;
