// Misc utils that don't fit anywhere else
import { derived, get } from 'svelte/store';

import { currentLang, isLocalized } from '$lib/i18n';
import Logger from '$lib/logger';

const _parseViews = (views: number | undefined, lang: string) => {
  if (!views || views < 1) {
    return 0;
  }

  const parser = new Intl.NumberFormat(lang, {
    notation: 'compact',
    compactDisplay: 'short'
  });

  return parser.format(views);
};

export const parseViews = derived(
  currentLang,
  (currentLang) => (views: number | undefined) => _parseViews(views, currentLang)
);

const ROUTE_ORDER = [
  '/',
  '/thoughts',
  '/thoughts/*',
  '/work',
  '/work/*',
  '/etc',
  '/experiments'
];

export const getNavigationDirection = (from?: string, to?: string) => {
  const _from = get(isLocalized) ? from?.replace(/\/[a-z]{2}\//, '/') : from,
    _to = get(isLocalized) ? to?.replace(/\/[a-z]{2}\//, '/') : to;

  if (!_from || !_to) {
    return 1;
  }

  const findRouteIndex = (route: string): number => {
    let bestMatchIndex = 1;
    let bestMatchLength = 0;

    ROUTE_ORDER.forEach((definedRoute, index) => {
      if (definedRoute.endsWith('/*')) {
        const basePath = definedRoute.slice(0, -1);

        if (route.startsWith(basePath) && basePath.length > bestMatchLength) {
          bestMatchIndex = index;
          bestMatchLength = basePath.length;
        }
      } else {
        if (route === definedRoute) {
          bestMatchIndex = index;
          bestMatchLength = route.length;
        }
      }
    });

    return bestMatchIndex;
  };

  const fromIndex = findRouteIndex(_from);
  const toIndex = findRouteIndex(_to);

  if (fromIndex === -1 || toIndex === -1) {
    Logger.error('Route not defined in ROUTE_ORDER', { from: _from, to: _to });
    return 0;
  }

  if (fromIndex < toIndex) {
    return 1;
  } else if (fromIndex > toIndex) {
    return -1;
  } else {
    return 0;
  }
};
