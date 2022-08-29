import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultTheme = 'dark';
const initialTheme = browser
  ? window.localStorage.getItem('theme') ?? defaultTheme
  : defaultTheme;

const theme = writable<string>(initialTheme);

theme.subscribe((value) => {
  browser && window.localStorage.setItem('theme', value);
});

const loading = writable(false);

export { loading, theme };
