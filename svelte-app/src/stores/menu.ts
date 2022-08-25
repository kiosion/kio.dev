import { writable } from 'svelte/store';

const menuOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

export { menuOpen, navOptions, pageHeading };
