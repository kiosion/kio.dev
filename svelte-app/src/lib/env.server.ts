import { ENV } from '$lib/env';
export const REMOTE_API_TOKEN: string =
  ENV === 'production'
    ? import.meta.env.VITE_API_TOKEN
    : import.meta.env.VITE_DEV_API_TOKEN;
