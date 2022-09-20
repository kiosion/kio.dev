import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { APP_ROUTES, TOP_LEVEL_ROUTES } from '$lib/consts';
import { isMobile } from '$helpers/browser';
import { canNavigate, navOptions, pageHeading } from '$stores/navigation';
import { get } from 'svelte/store';

export const setupNavigation = (route: string): void => {
  if (!route || route === '') {
    navOptions.set({ down: '', up: '' });
    pageHeading.set('');
    return;
  }
  const indexOf = TOP_LEVEL_ROUTES.findIndex((r) => r.path === route);
  switch (indexOf) {
    case -1:
      navOptions.set({ down: '', up: '' });
      pageHeading.set('');
      return;
    case 0:
      navOptions.set({
        down: TOP_LEVEL_ROUTES[indexOf + 1].path,
        up: ''
      });
      pageHeading.set('');
      return;
    case TOP_LEVEL_ROUTES.length - 1:
      navOptions.set({
        down: '',
        up: TOP_LEVEL_ROUTES[indexOf - 1].path
      });
      break;
    default:
      navOptions.set({
        down: TOP_LEVEL_ROUTES[indexOf + 1].path,
        up: TOP_LEVEL_ROUTES[indexOf - 1].path
      });
      break;
  }
  pageHeading.set(TOP_LEVEL_ROUTES[indexOf].name);
};

export const handleScrollNav = (
  event: WheelEvent,
  appBody: HTMLElement,
  currentPath: string
) => {
  if (
    !browser ||
    get(canNavigate) === false ||
    !event ||
    !appBody ||
    !currentPath ||
    isMobile()
  ) {
    return;
  }

  const { scrollTop, scrollHeight } = appBody,
    { deltaY } = event,
    height = scrollHeight - appBody.getBoundingClientRect().height,
    atTop = scrollTop === 0,
    atBottom = scrollTop === height,
    isTopLevelRoute = APP_ROUTES.some((route) => route.path === currentPath);

  if (
    (!atTop && deltaY < 0) ||
    (!atBottom && deltaY > 0) ||
    (!isTopLevelRoute && deltaY > 0) ||
    !deltaY ||
    Math.abs(deltaY) < 40
  ) {
    return;
  }

  const path =
    ((() => {
      return isTopLevelRoute
        ? deltaY > 0
          ? APP_ROUTES[APP_ROUTES.findIndex((r) => r.path === currentPath) + 1]
          : APP_ROUTES[APP_ROUTES.findIndex((r) => r.path === currentPath) - 1]
        : getClosestParent(APP_ROUTES, currentPath);
    })()?.path as string) || currentPath;

  if (path !== currentPath) {
    canNavigate.set(false);
    setTimeout(() => canNavigate.set(true), 500);
    return goto(path);
  }
};

const getClosestParent = (
  haystack: Record<string, unknown>[],
  needle: string
): Record<string, unknown> | undefined => {
  const parts = needle.split('/').filter((p) => p !== ''),
    find = (
      haystack: Record<string, unknown>[],
      needle: string
    ): Record<string, unknown> | undefined =>
      haystack.find((h) => h.path === needle);

  let path = '',
    result: Record<string, unknown> | undefined = undefined;

  parts.length > 1 && parts.pop();
  for (const part of parts) {
    (path += `/${part}`), (result = find(haystack, path));
    if (result) {
      return result.children
        ? getClosestParent(
          result.children as Record<string, unknown>[],
          needle
        ) || result
        : result;
    }
  }
};
