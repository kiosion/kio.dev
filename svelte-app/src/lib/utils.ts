// Misc utils that don't fit anywhere else
import { derived } from 'svelte/store';

import { currentLang } from '$lib/i18n';

import twemoji from 'twemoji';

export const parseEmoji = (element: HTMLElement) => {
  element && twemoji.parse(element),
    element?.querySelectorAll('img.emoji')?.forEach((emoji: Element) => {
      if (!(emoji as HTMLElement)?.style) {
        return;
      }
      (emoji as HTMLElement).setAttribute(
        'style',
        'display: inline-block;width: 1.1em;height: 1.1em;margin-right: 0.05em;vertical-align: -0.1em;'.replace(
          /\s+/g,
          ' '
        )
      );
    });
};

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
