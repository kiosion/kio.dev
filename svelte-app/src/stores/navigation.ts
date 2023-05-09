import { get, writable, type Writable } from 'svelte/store';
import type { Data } from '$helpers/toru';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

const nowPlayingData = writable<Data | undefined>(undefined);

const navLinks = writable<
  { name: string; url: string; active: boolean; hovered: boolean }[]
>([]);

export { navLinks, navOpen, navOptions, pageHeading, nowPlayingData };
