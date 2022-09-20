import { browser } from '$app/environment';
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
  initialSetting('highlightEffects', 'off')
);
highlightEffects.subscribe((value) => {
  browser && window.localStorage.setItem('feature-highlightEffects', value);
});

const reduceMotion = writable<string>(initialSetting('reduceMotion', 'off'));
reduceMotion.subscribe((value) => {
  browser && window.localStorage.setItem('feature-reduceMotion', value);
});

const sounds = writable<string>(initialSetting('sounds', 'on'));
sounds.subscribe((value) => {
  browser && window.localStorage.setItem('feature-sounds', value);
});

const customCursor = writable<string>(initialSetting('customCursor', 'on'));
customCursor.subscribe((value) => {
  browser && window.localStorage.setItem('feature-customCursor', value);
});

const comicSans = writable<string>(initialSetting('comicSans', 'off'));
comicSans.subscribe((value) => {
  browser && window.localStorage.setItem('feature-comicSans', value);
});

export {
  svgBackground,
  highlightEffects,
  reduceMotion,
  sounds,
  customCursor,
  comicSans
};
