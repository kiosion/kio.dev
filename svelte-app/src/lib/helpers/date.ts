import { get } from 'svelte/store';

import { currentLang } from '$i18n';

/**
 * Date helper to return various common human-readable date formats
 * @param dateStr ISO8601 date string
 * @param format Optional date format name, defaults to 'full'
 * @returns Date in human readable format
 * @example
 * formatDate('2020-01-02', 'full') // January 2, 2020
 * formatDate('2020-01-02', 'med') // Jan, 2020
 * formatDate('2020-01-02', 'short') // 1/2/20
 * formatDate('2020-01-02', 'rel') // 1 year ago
 */
export const formatDate = (
  dateStr: string,
  format: 'huge' | 'full' | 'med' | 'short' | 'rel' = 'full',
  lang: string = get(currentLang) || 'en'
) => {
  const date = new Date(dateStr);
  switch (format) {
    case 'full':
      return new Intl.DateTimeFormat(lang, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    case 'med':
      return new Intl.DateTimeFormat(lang, {
        month: 'short',
        year: 'numeric'
      }).format(date);
    case 'short':
      return new Intl.DateTimeFormat(lang, {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      }).format(date);
    case 'rel': {
      const rtf = new Intl.RelativeTimeFormat(lang, {
          numeric: 'auto'
        }),
        diff = new Date().getTime() - date.getTime(),
        years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365)),
        months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
        days = Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours = Math.floor(diff / (1000 * 60 * 60));

      let str = 'now';

      if (years > 0) {
        str = rtf.format(-years, 'year');
      } else if (months > 0) {
        str = rtf.format(-months, 'month');
      } else if (days > 0) {
        str = rtf.format(-days, 'day');
      } else if (hours > 0) {
        str = rtf.format(-hours, 'hour');
      }

      return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }
  }
};

/**
 * Get the estimated reading time for a given text
 * @param text String or array of strings to calculate reading time for
 * @returns Estimated reading time in minutes
 */
export const getReadingTime = (words: number): number =>
  Math.ceil(words ?? 0 / (100 / 60));
