import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultTheme = 'dark',
  prefersDark = '(prefers-color-scheme: dark)',
  prefersLight = '(prefers-color-scheme: light)';

const getInitialTheme = () => {
  if (browser) {
    const localStorage = window.localStorage.getItem('theme');
    if (localStorage && ['dark', 'light'].includes(localStorage)) {
      return localStorage;
    }
    if (window.matchMedia(prefersDark).matches) {
      return 'dark';
    } else if (window.matchMedia(prefersLight).matches) {
      return 'light';
    }
  }
  return defaultTheme;
};

const theme = writable<string>(getInitialTheme());

// Watch both mql's to watch for changes in the user's OS theme
if (browser) {
  window.matchMedia(prefersDark).addEventListener('change', (e) => {
    if (!window.localStorage.getItem('theme')) {
      e.matches && theme.set('dark');
    }
  });
  window.matchMedia(prefersLight).addEventListener('change', (e) => {
    if (!window.localStorage.getItem('theme')) {
      e.matches && theme.set('light');
    }
  });
}

// Subscribe to changes, update localstorage if in browser
theme.subscribe((value) => {
  if (browser) {
    const localStorage = window.localStorage.getItem('theme');
    if (localStorage && ['dark', 'light'].includes(localStorage)) {
      value !== localStorage && window.localStorage.setItem('theme', value);
    }
  }
});

const loading = writable(false);

export { loading, theme };
