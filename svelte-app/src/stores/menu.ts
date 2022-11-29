import { writable } from 'svelte/store';
import type { MenuState } from '$types';

const state = writable({} as MenuState);

export { state };
