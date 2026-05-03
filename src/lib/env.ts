export const ENV = (import.meta.env.MODE || import.meta.env.CONTEXT) as
  | 'testing'
  | 'development'
  | 'production';

export const BASE_URL = '/' as const;

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
