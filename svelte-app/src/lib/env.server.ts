import { ENV } from '$lib/env';

export const REMOTE_API_TOKEN: string =
  ENV === 'production'
    ? import.meta.env.VITE_API_TOKEN
    : import.meta.env.VITE_DEV_API_TOKEN;

export const SANITY_PROJECT_ID: string = import.meta.env.VITE_SANITY_PROJECT_ID;
export const SANITY_DATASET: 'production' | 'dev' =
  ENV === 'production' ? 'production' : 'dev';

export const SANITY_API_VERSION = 'v2022-11-29' as const;
export const SANITY_API_TOKEN: string = import.meta.env.VITE_SANITY_TOKEN;
