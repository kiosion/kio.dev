import { writable } from 'svelte/store';

import type { Data } from '$helpers/toru';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

const nowPlayingData = writable<Data | undefined>(undefined);

const navLinks = writable<
  {
    name: string;
    url: string;
    active: boolean;
    hovered: boolean;
    element?: HTMLAnchorElement;
  }[]
>([]);

export { navLinks, navOpen, navOptions, nowPlayingData, pageHeading };
