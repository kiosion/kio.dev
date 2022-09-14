import { writable } from 'svelte/store';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

const canNavigate = writable(false);

export { canNavigate, navOpen, navOptions, pageHeading };
