export const ENV: string = import.meta.env.MODE || import.meta.env.CONTEXT;

export const BASE_URL = '/';
export const API_URL = `${BASE_URL}api/`;

export const REMOTE_API_VERSION = 'v1';
export const REMOTE_API_BASE_URL =
  ENV === 'production'
    ? 'https://kio.sh'
    : ['backed', 'testing'].includes(ENV)
    ? 'https://dev.kio.sh'
    : 'http://localhost:4444';
export const REMOTE_API_URL = `${REMOTE_API_BASE_URL}/api/${REMOTE_API_VERSION}`;
export const REMOTE_CDN_URL = `${REMOTE_API_BASE_URL}/cdn`;

export const SELF_BASE_URL = (() => {
  switch (ENV) {
    case 'backed':
      return 'http://localhost:5173';
    case 'development':
      return 'http://localhost:5173';
    case 'testing':
      return 'http://localhost:3000';
    default:
      return 'https://kio.dev';
  }
})();
