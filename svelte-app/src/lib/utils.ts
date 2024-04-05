// Misc utils that don't fit anywhere else
import { derived } from 'svelte/store';

import { currentLang } from '$lib/i18n';

const _parseViews = (views: number | undefined, lang: string) => {
  if (!views || views < 1) {
    return 0;
  }

  const parser = new Intl.NumberFormat(lang, {
    notation: 'compact',
    compactDisplay: 'short'
  });

  return parser.format(views);
};

export const parseViews = derived(
  currentLang,
  (currentLang) => (views: number | undefined) => _parseViews(views, currentLang)
);
