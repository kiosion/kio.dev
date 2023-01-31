import { t, currentLang } from '$i18n';
import { get } from 'svelte/store';
import { DateTime } from 'luxon';

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
  format: 'huge' | 'full' | 'med' | 'short' | 'rel' = 'full'
) => {
  const date = DateTime.fromISO(dateStr).setLocale(get(currentLang) || 'en');

  switch (format) {
    case 'huge':
      return date.toLocaleString(DateTime.DATE_HUGE);
    case 'full':
      return date.toLocaleString(DateTime.DATE_FULL);
    case 'med':
      return date.toLocaleString({
        month: 'short',
        year: 'numeric'
      });
    case 'short':
      return date.toLocaleString(DateTime.DATE_SHORT);
    case 'rel': {
      const dur = DateTime.local({ locale: get(currentLang) || 'en' }).diff(
        date,
        ['years', 'months', 'days', 'hours']
      );
      const { years, months, days } = dur.toObject();

      return t('{duration} ago', {
        duration: dur
          .shiftTo(
            years ? 'years' : months ? 'months' : days ? 'days' : 'hours'
          )
          .toHuman({
            listStyle: 'long',
            maximumFractionDigits: 0,
            localeMatcher: 'best fit'
          })
      });
    }
  }
};

/**
 * Get the estimated reading time for a given text
 * @param text String or array of strings to calculate reading time for
 * @returns Estimated reading time in minutes
 */
export const getReadingTime = (text: string | string[]): number => {
  if (!text) {
    return 0;
  } else if (typeof text !== 'string') {
    text = text.join(' ');
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0).length;

  return Math.ceil(words / (100 / 60));
};
