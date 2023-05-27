import { writable } from 'svelte/store';

import type { ResData, SiteConfig } from '$types';

export const config = writable({} as ResData<SiteConfig>);
