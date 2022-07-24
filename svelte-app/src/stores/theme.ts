import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultTheme = 'light';
const initialTheme = browser ? window.localStorage.getItem('theme') ?? defaultTheme : defaultTheme;

const theme = writable<string>(initialTheme);

theme.subscribe((value) => {
  browser && window.localStorage.setItem('theme', value);
});

export { theme };
