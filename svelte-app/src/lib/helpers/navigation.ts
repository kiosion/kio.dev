import { derived, get } from 'svelte/store';

import { page } from '$app/stores';
import { currentLang, isLocalized, t } from '$i18n';
import { APP_ROUTES, BASE_PAGE_TITLE, ROUTE_ORDER } from '$lib/consts';

let prevPath: string;

const forward: string[] = [];
ROUTE_ORDER.forEach((route, index) => {
  index !== ROUTE_ORDER.length - 1 &&
    ROUTE_ORDER.forEach((subRoute, i) => {
      !(i <= index) && forward.push(`${route}-${subRoute}`);
    });
});

export const pageTitle = derived([currentLang, page], (_v) => {
  const basePathname = get(page)?.url?.pathname ?? '/',
    pathname = `/${
      (get(isLocalized) ? basePathname.slice(3) : basePathname.slice(1)).split('/')[0]
    }`;

  const route = APP_ROUTES.find((r) => r.path === pathname)?.name;

  return route?.length ? `${BASE_PAGE_TITLE} | ${get(t)(route)}` : BASE_PAGE_TITLE;
});

export const onNav = (path: string): 'forward' | 'backward' => {
  if (get(isLocalized) === true && path) {
    path = `/${path.slice(3)}`;
  }

  path = path.replace(/^\/{2,}/, '/').replace(/.+\/$/, '');

  if (!path) {
    return 'forward';
  }

  const prev = prevPath ?? path;
  prevPath = path;

  const toRoute = path.startsWith('/')
    ? path
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
    : path
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');
  const fromRoute = prev.startsWith('/')
    ? prev
        .slice(1)
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/')
    : prev
        .split('/')
        .map((part, i) => (i === 0 ? part : '*'))
        .join('/');

  const dirs = [
    fromRoute === '' ? 'index' : fromRoute,
    toRoute === '' ? 'index' : toRoute
  ].join('-');

  return forward.includes(dirs) ? 'forward' : 'backward';
};
