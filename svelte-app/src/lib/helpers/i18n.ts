import EN from '$langs/en.json';
import FR from '$langs/fr.json';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import Logger from '$lib/logger';
import { DEFAULT_APP_LANG, APP_LANGS } from '$lib/consts';

const isLocalized = writable(false);
const currentLang = writable(DEFAULT_APP_LANG);

const notFound = (key: string, lang: string, abbr = 0) => {
  abbr > 0
    ? Logger.errorOnce(
        `[i18n] Missing translation for key "${key}" in ${lang}.json & ${abbr} others}`
      )
    : Logger.errorOnce(
        `[i18n] Missing translation for key "${key}" in ${lang}.json`
      );
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
      ? notFound(enKeysNotInFr[0], 'en', enKeysNotInFr.length - 1)
      : enKeysNotInFr.forEach((key) => notFound(key, 'en'));
  }

  if (frKeysNotInEn.length) {
    frKeysNotInEn.length > 3
      ? notFound(frKeysNotInEn[0], 'fr', frKeysNotInEn.length - 1)
      : frKeysNotInEn.forEach((key) => notFound(key, 'fr'));
  }
};

const getKey = <T extends keyof typeof EN>(
  lang: string,
  key: T
): string | undefined => {
  switch (lang) {
    case 'en':
      return EN[key];
    case 'fr':
      return FR[key];
    default:
      return undefined;
  }
};

const translate = (key: string, params?: Record<string, unknown>): string => {
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
  return string
    ? replaceParams(string)
    : notFound(key, lang || DEFAULT_APP_LANG);
};

const linkTo = (path: string, lang?: string): string => {
  if (path.match(/(?:^(http|https|ftp|ssh)|^[^/].*\.([a-z]{2,6})).*?$/gim)) {
    return path;
  }

  lang = lang || get(currentLang);

  if (
    !lang ||
    path.startsWith(`/${lang}/`) ||
    (lang === 'en' && !get(page)?.params?.lang)
  ) {
    return path;
  }

  APP_LANGS.forEach((l) => path.startsWith(`/${l}/`) && (path = path.slice(3)));

  return APP_LANGS.includes(lang.toLowerCase() as (typeof APP_LANGS)[number])
    ? `/${lang}${path.startsWith('/') ? path : `/${path}`}`
    : path;
};

export { translate as t, linkTo, check, isLocalized, currentLang };
