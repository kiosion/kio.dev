/* eslint-disable func-call-spacing */
import { derived } from 'svelte/store';

import { currentLang, t } from '$i18n';

export const displayRange = derived([currentLang, t], ([currentLang, t]) => {
  return (start: string, end: string | undefined) => {
    try {
      const startDate = new Date(start),
        endDate = end ? new Date(end) : undefined;

      if (!endDate) {
        return `${new Intl.DateTimeFormat(currentLang, {
          month: 'short',
          year: 'numeric'
        }).format(startDate)} - ${t('present')}`;
      }

      return `${new Intl.DateTimeFormat(currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(startDate)} - ${new Intl.DateTimeFormat(currentLang, {
        month: 'short',
        year: 'numeric'
      }).format(endDate)}`;
    } catch (_) {
      return t('Invalid date');
    }
  };
});

export const displayMonthDuration = derived<
  typeof t,
  (startDate?: string | Date, endDate?: string | Date) => string
>(t, (t) => {
  return (startDate?: string | Date, endDate?: string | Date) => {
    if (!startDate) {
      return t('{month} month', { month: 1 });
    }

    const start = new Date(startDate),
      end = endDate ? new Date(endDate) : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    // Adjust for cases where the end month is earlier in the year than the start month
    if (months < 0) {
      years--;
      months += 12; // Add the months that have passed in the current year
    }

    // Consolidate total duration into years and months
    years += Math.floor(months / 12);
    months %= 12;

    let yearString = '',
      monthString = '';

    if (years > 0) {
      if (years === 1) {
        yearString = t('{year} year', { year: years });
      } else {
        yearString = t('{year} years', { year: years });
      }
    }

    if (months > 0) {
      if (months === 1) {
        monthString = t('{month} month', { month: months });
      } else {
        monthString = t('{month} months', { month: months });
      }
    }

    // Handle the case where the difference is less than one month
    if (years > 0 && months > 0) {
      monthString = t('{month} month', { month: 1 });
    }

    return `${yearString}${yearString && monthString ? ' ' : ''}${monthString}`;
  };
});
