import { get, readable, writable } from 'svelte/store';

import { page } from '$app/stores';
import EN from '$langs/en.json';
import FR from '$langs/fr.json';
import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
import Logger from '$lib/logger';

const isLocalized = writable(false);
const currentLang = writable(DEFAULT_APP_LANG);

const notFound = (key: string, lang: string, abbr = 0) => {
  abbr > 0
    ? Logger.errorOnce(
        `[i18n] Missing translation for key "${key}" in ${lang}.json & ${abbr} others}`
      )
    : Logger.errorOnce(`[i18n] Missing translation for key "${key}" in ${lang}.json`);
  return key;
};

// Check if both languages have the same keys
const check = () => {
  const enKeys = Object.keys(EN as Record<string, string>),
    frKeys = Object.keys(FR as Record<string, string>);

  const enKeysNotInFr = enKeys.filter((key) => !frKeys.includes(key)),
    frKeysNotInEn = frKeys.filter((key) => !enKeys.includes(key));

  if (enKeysNotInFr.length) {
    enKeysNotInFr.length > 3
      ? notFound(enKeysNotInFr[0], 'fr', enKeysNotInFr.length - 1)
      : enKeysNotInFr.forEach((key) => notFound(key, 'fr'));
  }

  if (frKeysNotInEn.length) {
    frKeysNotInEn.length > 3
      ? notFound(frKeysNotInEn[0], 'en', frKeysNotInEn.length - 1)
      : frKeysNotInEn.forEach((key) => notFound(key, 'en'));
  }
};

const getKey = <T extends keyof typeof EN>(lang: string, key: T): string | undefined => {
  switch (lang) {
    case 'en':
      return EN[key];
    case 'fr':
      return FR[key];
    default:
      return undefined;
  }
};

const _translate = (key: string, params?: Record<string, unknown>): string => {
  const lang = get(currentLang) || DEFAULT_APP_LANG;

  // For any provided params, replace the corresponding placeholders if any
  // e.g. "Hello {name}" with { name: "World" } becomes "Hello World"
  const replaceParams = (str: string) => {
    if (!params) {
      return str;
    }
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, value as string),
      str
    );
  };

  const string = getKey(lang || DEFAULT_APP_LANG, key as keyof typeof EN);

  if (string) {
    return replaceParams(string);
  } else {
    notFound(key, lang || DEFAULT_APP_LANG);
    return replaceParams(key);
  }
};

// eslint-disable-next-line func-call-spacing
const translate = readable<(key: string, params?: Record<string, unknown>) => string>(
  _translate,
  (set) => {
    const unsubscribe = currentLang.subscribe(() => {
      set(_translate);
    });
    return unsubscribe;
  }
);

const addSearchParams = (path: string, params?: URLSearchParams): string => {
  const search = params?.toString();

  return search ? `${path}${path.includes('?') ? '&' : '?'}${search}` : path;
};

const _linkTo: LinkTo = (
  path: string,
  paramsOrLang?: URLSearchParams | string,
  lang?: string
): string => {
  if (path.match(/(?:^(http|https|ftp|ssh)|^[^/].*\.([a-z]{2,6})).*?$/gim)) {
    return path;
  }

  let params: URLSearchParams | undefined;

  if (typeof paramsOrLang === 'string') {
    lang = paramsOrLang;
  } else if (typeof paramsOrLang === 'object') {
    params = paramsOrLang;
  }

  lang = lang || get(currentLang);

  if (
    !lang ||
    path.startsWith(`/${lang}/`) ||
    (lang === 'en' && !get(page)?.params?.lang)
  ) {
    return addSearchParams(path, params);
  }

  APP_LANGS.forEach((l) => path.startsWith(`/${l}/`) && (path = path.slice(3)));

  return APP_LANGS.includes(lang.toLowerCase() as (typeof APP_LANGS)[number])
    ? `/${lang}${
        path.startsWith('/')
          ? addSearchParams(path, params)
          : `/${addSearchParams(path, params)}`
      }`
    : addSearchParams(path, params);
};

interface LinkTo {
  (pathname: string, lang?: string): string;
  (pathname: string, params: URLSearchParams, lang?: string): string;
}

const linkTo = readable<LinkTo>(_linkTo, (set) =>
  currentLang.subscribe(() => set(_linkTo))
);

export { check, currentLang, isLocalized, linkTo, translate as t };
