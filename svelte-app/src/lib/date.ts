/* eslint-disable func-call-spacing */
import { derived } from 'svelte/store';

import { currentLang, t } from '$lib/i18n';

export const formatDate = derived(
  [currentLang],
  ([currentLang]) =>
    (
      dateStr: string | null | undefined,
      format: 'full' | 'med' | 'short' | 'days' = 'full'
    ) => {
      if (!dateStr) {
        return '';
      }
      const date = new Date(dateStr);

      switch (format) {
        case 'full':
          return new Intl.DateTimeFormat(currentLang, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
          }).format(date);
        case 'short':
          return new Intl.DateTimeFormat(currentLang, {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
          }).format(date);
        case 'med':
          return new Intl.DateTimeFormat(currentLang, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
          }).format(date);
        case 'days': {
          const now = new Date(),
            diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

          return new Intl.RelativeTimeFormat(currentLang, {
            numeric: 'auto'
          }).format(-diffDays, 'day');
        }
      }
    }
);

export const displayRange = derived([currentLang, t], ([currentLang, t]) => {
  return (start: string | undefined, end: string | undefined) => {
    if (!start) {
      return t('present');
    }

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
      return t('{months} months', { months: diffMonths });
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

export const sortDocumentsByYear = <T extends { date?: string; _createdAt: string }>(
  documents: T[]
) => {
  const grouped =
    documents.reduce(
      (acc, doc) => {
        const year = new Date(doc.date || doc._createdAt).getFullYear();

        !acc[year] && (acc[year] = []);
        acc[year].push(doc);

        return acc;
      },
      {} as Record<string, NonNullable<T[]>>
    ) || {};

  return Object.keys(grouped)
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
    .map((group) => {
      return {
        year: parseInt(group, 10),
        items: grouped[group].sort((a, b) => {
          const aDate = new Date(a.date || a._createdAt);
          const bDate = new Date(b.date || b._createdAt);
          return bDate.getTime() - aDate.getTime();
        })
      };
    });
};
