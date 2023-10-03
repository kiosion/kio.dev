import { derived } from 'svelte/store';

import { page } from '$app/stores';
import { isLocalized, t } from '$i18n';
import { APP_LANGS, APP_ROUTES, BASE_PAGE_TITLE, ROUTE_ORDER } from '$lib/consts';

const langRegex = new RegExp(`^/(${APP_LANGS.join('|')})`),
  firstSegRegex = /^\/([^/]+)/,
  subsequentSegRegex = /\//g;

const normalizePath = (path: string) => {
  if (path.match(langRegex)) {
    path = path.slice(3);
  }

  if (!path || path === '/') {
    return 'index';
  }

  const firstSegmentMatch = path.match(firstSegRegex);

  if (!firstSegmentMatch) {
    return '';
  }

  const subsequentSegmentsCount = (path.match(subsequentSegRegex) || []).length - 1;

  return firstSegmentMatch[1] + '/*'.repeat(subsequentSegmentsCount);
};

const forward = new Set<string>();

for (let i = 0; i < ROUTE_ORDER.length - 1; ++i) {
  for (let j = i + 1; j < ROUTE_ORDER.length; ++j) {
    forward.add(`${ROUTE_ORDER[i]}-${ROUTE_ORDER[j]}`);
  }
}

let prevPath: string;

export const onNav = (path: string) => {
  const newPath = normalizePath(path),
    oldPath = prevPath ? prevPath : newPath;

  prevPath = newPath;

  return forward.has(`${oldPath}-${newPath}`) ? 'forward' : 'backward';
};

export const pageTitle = derived([isLocalized, t, page], (vals) => {
  const basePathname = vals[2]?.url?.pathname ?? '/',
    pathname = `/${
      (vals[0] ? basePathname.slice(4) : basePathname.slice(1)).split('/')[0]
    }`,
    route = APP_ROUTES.find((r) => r.path === pathname);

  return route?.name?.length
    ? `${BASE_PAGE_TITLE} ~ ${vals[1](route.name)}`
    : BASE_PAGE_TITLE;
});
