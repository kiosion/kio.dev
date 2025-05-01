export const ENV = (import.meta.env.MODE || import.meta.env.CONTEXT) as
  | 'testing'
  | 'development'
  | 'production';

export const BASE_URL = '/' as const;
export const API_URL = `${BASE_URL}api` as const;

export const SANITY_PROJECT_ID: string = import.meta.env.VITE_SANITY_PROJECT_ID;
export const SANITY_DATASET: 'production' | 'dev' =
  ENV === 'production' ? 'production' : 'dev';

export const SELF_BASE_URL = (() => {
  switch (ENV) {
    case 'development':
      return 'http://localhost:5173';
    case 'testing':
      return 'http://localhost:3000';
    default:
      return 'https://kio.dev';
  }
})();

export const APP_VERSION = import.meta.env.VITE_APP_VERSION as string | undefined;
