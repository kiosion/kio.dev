import { writable } from 'svelte/store';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

export { navOpen, navOptions, pageHeading };
