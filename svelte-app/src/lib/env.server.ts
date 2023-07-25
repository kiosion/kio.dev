import { ENV } from '$lib/env';
export const REMOTE_API_TOKEN: string =
  ENV === 'production'
    ? import.meta.env.VITE_API_TOKEN
    : import.meta.env.VITE_DEV_API_TOKEN;

export const GITHUB_APPLICATION_ID: string =
  ENV === 'production'
    ? import.meta.env.VITE_GITHUB_APPLICATION_ID
    : import.meta.env.VITE_GITHUB_APPLICATION_ID_DEV;

export const GITHUB_APPLICATION_SECRET: string =
  ENV === 'production'
    ? import.meta.env.VITE_GITHUB_APPLICATION_SECRET
    : import.meta.env.VITE_GITHUB_APPLICATION_SECRET_DEV;

export const GITHUB_OAUTH_BASE_URL = 'https://github.com/login/oauth/authorize';

export const GITHUB_OAUTH_ACCESS_TOKEN_EXCHANGE_URL =
  'https://github.com/login/oauth/access_token';
