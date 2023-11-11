import { get } from 'svelte/store';

import { currentLang } from '$i18n';

export const formatDate = (
  dateStr: string,
  format: 'full' | 'med' | 'short' = 'full',
  lang: string = get(currentLang) || 'en'
) => {
  const date = new Date(dateStr);

  switch (format) {
    case 'full':
      return new Intl.DateTimeFormat(lang, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(date);
    case 'short':
      return new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(date);
    case 'med':
      return new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(date);
  }
};

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
