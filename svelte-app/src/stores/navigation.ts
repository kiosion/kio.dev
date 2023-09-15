import { writable } from 'svelte/store';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

const navLinks = writable<
  {
    name: string;
    url: string;
    active: boolean;
    hovered: boolean;
    element?: HTMLAnchorElement;
  }[]
>([]);

export { navLinks, navOpen, navOptions, pageHeading };
