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
      end = endDate ? new Date(endDate) : new Date(),
      diffMs = end.getTime() - start.getTime(),
      diffDays = Math.floor(diffMs / 86400000),
      diffMonths = Math.floor(diffDays / 30);

    if (diffMonths === 0 || diffMonths === 1) {
      return t('{month} month', { month: 1 });
    }

    if (diffMonths < 12) {
      return t('{month} months', { month: diffMonths });
    }

    const years = Math.floor(diffMonths / 12),
      months = diffMonths % 12;

    let yearString = '',
      monthString = '';

    if (years > 0) {
      if (years === 1) {
        yearString = t('{year} year', { year: years });
      } else {
        yearString = t('{years} years', { years });
      }
    }

    if (months > 0) {
      if (months === 1) {
        monthString = t('{month} month', { month: months });
      } else {
        monthString = t('{months} months', { months });
      }
    }

    return `${yearString}${yearString && monthString ? ' ' : ''}${monthString}`;
  };
});
