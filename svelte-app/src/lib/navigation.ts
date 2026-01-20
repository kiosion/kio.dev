import type { Page as PageStore } from '@sveltejs/kit';
import { page } from '$app/stores';
import { APP_ROUTES, BASE_PAGE_TITLE } from '$lib/consts';
import { isLocalized, t } from '$lib/i18n';
import { derived } from 'svelte/store';

export const pageTitle = derived([isLocalized, t, page], (vals) => {
  const basePathname = vals[2]?.url?.pathname ?? '/',
    pathname = `/${
      (vals[0] ? basePathname.slice(4) : basePathname.slice(1)).split('/')[0]
    }`,
    route = APP_ROUTES.find((r) => r.path === pathname);

  return route?.name?.length
    ? `${vals[1](route.name)} | ${BASE_PAGE_TITLE}`
    : BASE_PAGE_TITLE;
});

export const scrollTo = (
  url: PageStore['url'],
  scrollParams: ScrollIntoViewOptions = {},
) => {
  const { hash } = url || { hash: '' };

  if (!hash.length) {
    return;
  }

  const target =
    document.getElementById(hash.slice(1)) ||
    document.getElementById(`heading-${hash.slice(1)}`);

  target?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...scrollParams,
  });
};
