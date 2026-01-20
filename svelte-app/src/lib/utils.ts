// Misc utils that don't fit anywhere else
import { ROUTE_ORDER } from '$lib/consts';
import { currentLang, isLocalized } from '$lib/i18n';
import Logger from '$lib/logger';
import RouteTrie from '$lib/route-trie';
import { derived, get } from 'svelte/store';

const _parseViews = (views: number | undefined, lang: string) => {
  if (!views || views < 1) {
    return 0;
  }

  const parser = new Intl.NumberFormat(lang, {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return parser.format(views);
};

export const parseViews = derived(
  currentLang,
  (currentLang) => (views: number | undefined) => _parseViews(views, currentLang),
);

const routeTrie = new RouteTrie();
ROUTE_ORDER.forEach((route, index) => routeTrie.insert(route, index));

const stripTrailingSlash = (p: string) =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;

const stripLocalePrefix = (p: string) =>
  get(isLocalized) ? p.replace(/\/[a-z]{2}\//, '/') : p;

export const pathnameGroupKey = (pathname: string) => {
  // collapse tag routes into one group
  if (pathname === '/thoughts' || pathname.startsWith('/thoughts/+')) {
    return '/thoughts';
  }
  return pathname;
};

export const normalizePathname = (p?: string) => {
  if (!p) {
    return '/';
  }
  const base = stripTrailingSlash(stripLocalePrefix(p));
  return base || '/';
};

export const getNavigationDirection = (from?: string, to?: string) => {
  const _from = normalizePathname(from);
  const _to = normalizePathname(to);

  if (!_from || !_to) {
    return 1;
  }

  const fromKey = pathnameGroupKey(_from);
  const toKey = pathnameGroupKey(_to);

  if (fromKey === toKey) {
    return 0;
  }

  const fromIndex = routeTrie.search(fromKey);
  const toIndex = routeTrie.search(toKey);

  if (fromIndex === null || toIndex === null) {
    Logger.error('Route not defined in ROUTE_ORDER', { from: fromKey, to: toKey });
    return 0;
  }

  return fromIndex < toIndex ? 1 : fromIndex > toIndex ? -1 : 0;
};
