import { derived } from 'svelte/store';

import { page } from '$app/stores';
import { isLocalized, t } from '$i18n';
import { APP_ROUTES, BASE_PAGE_TITLE } from '$lib/consts';

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
