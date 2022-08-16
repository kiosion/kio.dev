import { browser } from '$app/env';
import { writable } from 'svelte/store';

const initialSetting = (feature: string, fallback = 'off') => {
  return browser
    ? window.localStorage.getItem(`feature-${feature}`) ?? fallback
    : fallback;
};

const svgBackground = writable<string>(initialSetting('svgBackground'));
svgBackground.subscribe((value) => {
  browser && window.localStorage.setItem('feature-svgBackground', value);
});

const highlightEffects = writable<string>(
  initialSetting('highlightEffects', 'on')
);
highlightEffects.subscribe((value) => {
  browser && window.localStorage.setItem('feature-highlightEffects', value);
});

export { svgBackground, highlightEffects };
