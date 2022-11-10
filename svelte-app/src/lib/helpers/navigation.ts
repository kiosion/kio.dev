import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { APP_ROUTES, TOP_LEVEL_ROUTES, APP_LANGS } from '$lib/consts';
import { isMobile } from '$helpers/browser';
import { canNavigate, navOptions, pageHeading } from '$stores/navigation';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { t, linkTo } from '$i18n';

export const setupNavigation = (route: string): void => {
  const isLocalized = APP_LANGS.includes(get(page)?.params?.lang);

  isLocalized &&
    (route = route.slice(3).startsWith('/')
      ? route.slice(3)
      : `/${route.slice(3)}`);

  if (!route || route === '') {
    navOptions.set({ down: '', up: '' });
    pageHeading.set('');
    return;
  }

  const index = TOP_LEVEL_ROUTES.findIndex((r) => r.path === route);

  switch (index) {
    case -1:
      navOptions.set({ down: '', up: '' });
      pageHeading.set('');
      return;
    case 0:
      navOptions.set({
        down: TOP_LEVEL_ROUTES[index + 1].path,
        up: ''
      });
      pageHeading.set('');
      return;
    case TOP_LEVEL_ROUTES.length - 1:
      navOptions.set({
        down: '',
        up: TOP_LEVEL_ROUTES[index - 1].path
      });
      break;
    default:
      navOptions.set({
        down: TOP_LEVEL_ROUTES[index + 1].path,
        up: TOP_LEVEL_ROUTES[index - 1].path
      });
      break;
  }
  pageHeading.set(t(TOP_LEVEL_ROUTES[index].name));
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

  const isLocalized = APP_LANGS.includes(get(page)?.params?.lang);

  if (isLocalized) {
    const sliced = currentPath.slice(3);
    currentPath = sliced.startsWith('/') ? sliced : `/${sliced}`;
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
    canNavigate.set(false);
    setTimeout(() => canNavigate.set(true), 1000);
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
    setTimeout(() => canNavigate.set(true), 1000);
    return goto(linkTo(path));
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
    result: Record<string, unknown> | undefined;

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

let prevPath: string;

const routes = [
  'features',
  'index',
  'blog',
  'blog/*',
  'blog/*/*',
  'blog/+/*',
  'art',
  'art/*',
  'work',
  'work/*',
  'work/*/*',
  'work/+/*',
  'about',
  'pgp'
];

const forward: string[] = [];
routes.forEach((route, index) => {
  index !== routes.length - 1 &&
    routes.forEach((subRoute, i) => {
      !(i <= index) && forward.push(`${route}-${subRoute}`);
    });
});

export const onNav = (path: string): 'forward' | 'backward' => {
  const isLocalized = APP_LANGS.includes(get(page)?.params?.lang);

  path = path.replace(/.+\/$/, '');

  if (isLocalized && path) {
    path = `/${path.slice(3)}`;
  }

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
