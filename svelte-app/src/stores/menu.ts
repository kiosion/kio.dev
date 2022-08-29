import { writable } from 'svelte/store';
import type { MenuState } from '$lib/types';

const state = writable({} as MenuState);

export { state };
