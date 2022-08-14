import { browser } from '$app/env';
import { writable } from 'svelte/store';

const initialSetting = (feature: string, fallback?: string) => {
  return browser ? window.localStorage.getItem(feature) ?? fallback : fallback;
};

const svgBackground = writable<string>(initialSetting('svgBackground', 'off'));
svgBackground.subscribe((value) => {
  browser && window.localStorage.setItem('svgBackground', value);
});

const highlightEffects = writable<string>(
  initialSetting('highlightEffects', 'on')
);
highlightEffects.subscribe((value) => {
  browser && window.localStorage.setItem('highlightEffects', value);
});

export { svgBackground, highlightEffects };
