import { page } from '$app/stores';
import EN from '$langs/en.json';
import FR from '$langs/fr.json';
import { APP_LANGS, DEFAULT_APP_LANG } from '$lib/consts';
import Logger from '$lib/logger';
import type { LocaleKey } from '$types/generated';
import { derived, get, writable } from 'svelte/store';

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
  const enKeys = Object.keys(EN),
    frKeys = Object.keys(FR);

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

const getLocaleObject = (lang: (typeof APP_LANGS)[number]) => {
  switch (lang) {
    case 'en':
      return EN;
    case 'fr':
      return FR;
    default:
      return undefined;
  }
};

const getKey = (
  localeObject: typeof EN | typeof FR | undefined,
  key: LocaleKey
): string | undefined => {
  if (!localeObject) {
    return undefined;
  }

  const keys = key.split('.');

  let currentObject: Record<string, unknown> = localeObject;

  for (const keyPart of keys) {
    if (currentObject?.[keyPart] === undefined) {
      return undefined;
    }

    switch (typeof currentObject?.[keyPart]) {
      case 'string':
        return currentObject[keyPart] as string;
      case 'object':
        currentObject = currentObject[keyPart] as Record<string, unknown>;
        break;
      default:
        return undefined;
    }
  }
};

type ExtractTVars<S> = S extends `${infer _Prefix}{${infer Var}}${infer Rest}`
  ? Var | ExtractTVars<Rest>
  : never;

const _translate = <K extends LocaleKey>(
  currentLang: string | undefined,
  key: K,
  params?: ExtractTVars<K> extends never
    ? never
    : Record<ExtractTVars<K>, string | number>,
  overrideLang?: string
): string => {
  const lang = overrideLang || currentLang || DEFAULT_APP_LANG;

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

  const locale = getLocaleObject(lang),
    string = getKey(locale, key);

  if (string) {
    return replaceParams(string);
  } else {
    notFound(key, lang);
    return replaceParams(key);
  }
};

const translate = derived<
  typeof currentLang,
  <K extends LocaleKey>(
    key: K,
    params?: ExtractTVars<K> extends never
      ? never
      : Record<ExtractTVars<K>, string | number>,
    overrideLang?: string
  ) => string
>(
  currentLang,
  (val: string) =>
    <K extends LocaleKey>(
      key: K,
      params?: ExtractTVars<K> extends never
        ? never
        : Record<ExtractTVars<K>, string | number>,
      overrideLang?: string
    ) =>
      _translate(val, key, params, overrideLang)
);

const addSearchParams = (path: string, params?: URLSearchParams): string => {
  const search = params?.toString();

  return search ? `${path}${path.includes('?') ? '&' : '?'}${search}` : path;
};

const _linkTo = (
  currentLang: string | undefined,
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

  lang ||= currentLang || DEFAULT_APP_LANG;

  if (
    !lang ||
    path.startsWith(`/${lang}/`) ||
    (lang === 'en' && !get(page)?.params?.lang)
  ) {
    return addSearchParams(path, params);
  }

  APP_LANGS.forEach((l) => path.startsWith(`/${l}/`) && (path = path.slice(3)));

  return APP_LANGS.includes(lang.toLowerCase())
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

const linkTo = derived(
  currentLang,
  (val) =>
    ((path: string, paramsOrLang?: URLSearchParams | string, lang?: string) =>
      _linkTo(val, path, paramsOrLang, lang)) as LinkTo
);

export { check, currentLang, isLocalized, linkTo, translate as t };
