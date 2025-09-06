import type { page } from '$app/state';
import { APP_ROUTES, BASE_PAGE_TITLE } from '$lib/consts';
import type { GetConfigQueryResult } from '$types/generated/sanity.types';

export const PageMeta = $state({ title: BASE_PAGE_TITLE, desc: '' });

export const getPageTitle = (state: typeof page) => {
  const basePathname = state?.url?.pathname ?? '/',
      pathname = `/${
        basePathname.slice(1).split('/')[0]
      }`,
      route = APP_ROUTES.find((r) => r.path === pathname);
  
    return route?.name?.length
      ? `${route.name} | ${BASE_PAGE_TITLE}`
      : BASE_PAGE_TITLE;
};

export const scrollTo = (
  url: URL | undefined,
  scrollParams: ScrollIntoViewOptions = {}
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
    ...scrollParams
  });
};
