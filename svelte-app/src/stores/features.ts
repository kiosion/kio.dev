import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { isMobile } from '$helpers/browser';

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
  initialSetting('highlightEffects', !isMobile ? 'on' : 'off')
);
highlightEffects.subscribe((value) => {
  browser && window.localStorage.setItem('feature-highlightEffects', value);
});

const reduceMotion = writable<string>(initialSetting('reduceMotion', 'off'));
reduceMotion.subscribe((value) => {
  browser && window.localStorage.setItem('feature-reduceMotion', value);
});

const sounds = writable<string>(
  initialSetting('sounds', !isMobile ? 'on' : 'off')
);
sounds.subscribe((value) => {
  browser && window.localStorage.setItem('feature-sounds', value);
});

const comicSans = writable<string>(initialSetting('comicSans', 'off'));
comicSans.subscribe((value) => {
  browser && window.localStorage.setItem('feature-comicSans', value);
});

export { svgBackground, highlightEffects, reduceMotion, sounds, comicSans };
