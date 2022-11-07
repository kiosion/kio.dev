import EN from '$langs/en.json';
import FR from '$langs/fr.json';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import Logger from '$lib/logger';
import { DEFAULT_APP_LANG, APP_LANGS } from '$lib/consts';

const notFound = (key: string, lang: string, abbr = 0) => {
  abbr > 0
    ? Logger.error(
        `i18n: Missing translation for key "${key}" in ${lang}.json & ${abbr} others}`
      )
    : Logger.error(
        `i18n: Missing translation for key "${key}" in ${lang}.json`
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

const translate = (key: string): string => {
  const { lang } = get(page)?.params ?? {};

  if (!lang) {
    const string = getKey('en', key as keyof typeof EN);
    return !string && string !== '' ? notFound(key, DEFAULT_APP_LANG) : string;
  }

  const string = getKey(lang, key as keyof typeof EN);
  return !string && string !== '' ? notFound(key, lang) : string;
};

const linkTo = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }

  const { params } = get(page),
    lang = params?.lang;

  if (!lang || path.startsWith(`/${lang}/`)) {
    return path;
  }

  return APP_LANGS.includes(lang.toLowerCase())
    ? `/${lang}${path.startsWith('/') ? path : `/${path}`}`
    : path;
};

export { translate as t, linkTo, check };
