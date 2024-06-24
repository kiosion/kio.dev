// Misc utils that don't fit anywhere else
import { derived, get } from 'svelte/store';

import { currentLang, isLocalized } from '$lib/i18n';
import Logger from '$lib/logger';
import RouteTrie from '$lib/route-trie';
import { ROUTE_ORDER } from '$lib/consts';

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

const routeTrie = new RouteTrie();
ROUTE_ORDER.forEach((route, index) => routeTrie.insert(route, index));

export const getNavigationDirection = (from?: string, to?: string) => {
  const _from = get(isLocalized) ? from?.replace(/\/[a-z]{2}\//, '/') : from,
    _to = get(isLocalized) ? to?.replace(/\/[a-z]{2}\//, '/') : to;

  if (!_from || !_to) {
    return 1;
  }

  const fromIndex = routeTrie.search(_from),
    toIndex = routeTrie.search(_to);

  if (fromIndex === null || toIndex === null) {
    Logger.error('Route not defined in ROUTE_ORDER', { from: _from, to: _to });
    return 0;
  }

  return fromIndex < toIndex ? 1 : fromIndex > toIndex ? -1 : 0;
};
