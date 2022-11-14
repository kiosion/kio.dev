import { writable } from 'svelte/store';

const navOpen = writable(false);

const navOptions = writable({ down: '', up: '' });

const pageHeading = writable('');

const showSidebarToggle = writable(false);

const sidebarOpen = writable(true);

const canNavigate = writable(false);

export {
  canNavigate,
  navOpen,
  showSidebarToggle,
  sidebarOpen,
  navOptions,
  pageHeading
};
