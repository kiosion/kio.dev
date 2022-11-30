export const ENV: string = import.meta.env.MODE || import.meta.env.CONTEXT;
export const BASE_URL = '/';
export const API_URL = `${BASE_URL}api/`;
export const REMOTE_API_VERSION = 'v1';
export const REMOTE_API_URL =
  ENV === 'production'
    ? `https://kio.sh/api/${REMOTE_API_VERSION}`
    : ENV === 'backed'
    ? `https://dev.kio.sh/api/${REMOTE_API_VERSION}`
    : `http://localhost:4444/api/${REMOTE_API_VERSION}`;
export const REMOTE_CDN_URL =
  ENV === 'production'
    ? 'https://kio.sh/cdn'
    : ENV === 'backed'
    ? 'https://dev.kio.sh/cdn'
    : 'http://localhost:4444/cdn';
