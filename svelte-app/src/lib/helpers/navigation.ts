import { TOP_LEVEL_ROUTES, ROUTE_ORDER } from '$lib/consts';
import { navOptions, pageHeading } from '$stores/navigation';
import { get } from 'svelte/store';
import { t, isLocalized } from '$i18n';

export const setupNavigation = (route: string): void => {
  get(isLocalized) === true &&
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
      // console.log('index 0 for:', route);
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
  pageHeading.set(`kio.dev | ${t(TOP_LEVEL_ROUTES[index].name)}`);
};

let prevPath: string;

const forward: string[] = [];
ROUTE_ORDER.forEach((route, index) => {
  index !== ROUTE_ORDER.length - 1 &&
    ROUTE_ORDER.forEach((subRoute, i) => {
      !(i <= index) && forward.push(`${route}-${subRoute}`);
    });
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
